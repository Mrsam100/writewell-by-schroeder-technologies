import { Hono } from "hono";
import type { AppEnv } from "../app";
import { findByEmail, createUser, findById } from "../db/repositories/users";
import { hashPassword, verifyPassword, dummyVerify } from "../auth/password";
import { createSession, deleteSession, setSessionCookie, getSessionCookie, clearSessionCookie } from "../auth/session";
import { rotateCsrfCookie, ensureCsrfCookie } from "../auth/csrf";
import { requireAuth } from "../middleware/auth";
import { authRateLimit } from "../middleware/rateLimit";

const auth = new Hono<AppEnv>();

const MAX_PASSWORD_LENGTH = 72;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

// ── Register ────────────────────────────────────────────────────────────
auth.post("/register", authRateLimit, async (c) => {
  const body = await c.req.json();
  const { password, name } = body;
  const rawEmail = body.email;

  if (!rawEmail || !password || typeof rawEmail !== "string" || typeof password !== "string") {
    return c.json({ error: "Email and password are required." }, 400);
  }

  const email = normalizeEmail(rawEmail);

  if (!EMAIL_REGEX.test(email)) {
    return c.json({ error: "Please provide a valid email address." }, 400);
  }
  if (password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters." }, 400);
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return c.json({ error: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.` }, 400);
  }
  if (name && (typeof name !== "string" || name.trim().length > 100)) {
    return c.json({ error: "Name must be 100 characters or fewer." }, 400);
  }

  const passwordHash = await hashPassword(password);
  const trimmedName = name ? name.trim() : null;

  const user = await createUser(email, passwordHash, trimmedName);
  if (!user) {
    return c.json({ error: "An account with this email already exists." }, 409);
  }

  // Create session and set cookies (rotate CSRF on auth state change)
  const sessionId = await createSession(user.id);
  setSessionCookie(c, sessionId);
  rotateCsrfCookie(c);

  return c.json({ user }, 201);
});

// ── Login ───────────────────────────────────────────────────────────────
auth.post("/login", authRateLimit, async (c) => {
  const body = await c.req.json();
  const { password } = body;
  const rawEmail = body.email;

  if (!rawEmail || !password || typeof rawEmail !== "string" || typeof password !== "string") {
    return c.json({ error: "Email and password are required." }, 400);
  }

  const email = normalizeEmail(rawEmail);
  const user = await findByEmail(email);

  if (!user) {
    // Timing-safe: still run password verification
    await dummyVerify(password);
    return c.json({ error: "Invalid email or password." }, 401);
  }

  const valid = await verifyPassword(password, user.passwordHash, user.id);
  if (!valid) {
    return c.json({ error: "Invalid email or password." }, 401);
  }

  // Create session and set cookies (rotate CSRF on auth state change)
  const sessionId = await createSession(user.id);
  setSessionCookie(c, sessionId);
  rotateCsrfCookie(c);

  return c.json({ user: { id: user.id, email: user.email, name: user.name } });
});

// ── Logout ──────────────────────────────────────────────────────────────
auth.post("/logout", async (c) => {
  const sessionId = getSessionCookie(c);
  if (sessionId) {
    await deleteSession(sessionId).catch(() => {});
  }
  clearSessionCookie(c);
  return c.json({ ok: true });
});

// ── Me ──────────────────────────────────────────────────────────────────
auth.get("/me", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const user = await findById(authUser.userId);
  if (!user) return c.json({ error: "User not found." }, 404);

  // Always ensure CSRF cookie is set on /me (called on page load)
  ensureCsrfCookie(c);

  return c.json({ user });
});

export default auth;
