/** @license SPDX-License-Identifier: Apache-2.0 */
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getSql } from "../db/index";
import { config } from "../config";
import { authenticate, type AuthPayload } from "../middleware/auth";
import { authRateLimit } from "../middleware/rateLimit";

const router = Router();

// Bcrypt silently truncates at 72 bytes -- cap password length to prevent surprise
const MAX_PASSWORD_LENGTH = 72;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Normalize email: trim whitespace and lowercase. */
function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

// ── Register ────────────────────────────────────────────────────────────
router.post("/register", authRateLimit, async (req, res, next) => {
  try {
    const { password, name } = req.body;
    const rawEmail = req.body.email;

    if (!rawEmail || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const email = normalizeEmail(rawEmail);

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.` });
    }
    if (name && (typeof name !== "string" || name.trim().length > 100)) {
      return res.status(400).json({ error: "Name must be 100 characters or fewer." });
    }

    const sql = getSql();
    const passwordHash = await bcrypt.hash(password, 12);
    const trimmedName = name ? name.trim() : null;

    // Use ON CONFLICT to handle race condition atomically
    const rows = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${trimmedName})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, name
    `;

    if (rows.length === 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const user = rows[0] as { id: number; email: string; name: string | null };
    const token = jwt.sign(
      { userId: user.id, email: user.email } as AuthPayload,
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
});

// ── Login ───────────────────────────────────────────────────────────────
// Dummy hash used when no user is found -- prevents timing side-channel
// that would reveal whether an email is registered.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

router.post("/login", authRateLimit, async (req, res, next) => {
  try {
    const { password } = req.body;
    const rawEmail = req.body.email;

    if (!rawEmail || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const email = normalizeEmail(rawEmail);
    const sql = getSql();

    // Only fetch needed columns -- never SELECT *
    const rows = await sql`
      SELECT id, email, name, password_hash FROM users WHERE email = ${email}
    `;
    const user = rows[0] as { id: number; email: string; name: string; password_hash: string } | undefined;

    // Always run bcrypt.compare even if user doesn't exist (timing-safe)
    const hashToCompare = user?.password_hash || DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email } as AuthPayload,
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// ── Me ──────────────────────────────────────────────────────────────────
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const sql = getSql();
    const rows = await sql`SELECT id, email, name, created_at FROM users WHERE id = ${req.user!.userId}`;
    if (rows.length === 0) return res.status(404).json({ error: "User not found." });
    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
