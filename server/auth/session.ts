import crypto from "crypto";
import { eq, and, gt, lt } from "drizzle-orm";
import { getDb } from "../db/index";
import { sessions } from "../db/schema";
import { config } from "../config";
import type { Context } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";

const SESSION_COOKIE = "writewell_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_SESSIONS_PER_USER = 5;

// Session ID: 64 hex chars (32 random bytes)
const SESSION_ID_REGEX = /^[0-9a-f]{64}$/;

function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Validate session ID format before hitting the DB */
function isValidSessionId(id: string): boolean {
  return SESSION_ID_REGEX.test(id);
}

export async function createSession(userId: number): Promise<string> {
  const db = getDb();
  const id = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Enforce max sessions per user: delete oldest beyond limit
  const existing = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(sessions.createdAt);

  if (existing.length >= MAX_SESSIONS_PER_USER) {
    const toDelete = existing.slice(0, existing.length - MAX_SESSIONS_PER_USER + 1);
    for (const s of toDelete) {
      await db.delete(sessions).where(eq(sessions.id, s.id));
    }
  }

  await db.insert(sessions).values({ id, userId, expiresAt });
  return id;
}

export async function validateSession(sessionId: string): Promise<{ userId: number } | null> {
  if (!isValidSessionId(sessionId)) return null;
  const db = getDb();
  const rows = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] || null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  if (!isValidSessionId(sessionId)) return;
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function deleteUserSessions(userId: number): Promise<void> {
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

/** Probabilistic cleanup: delete expired sessions (call with ~1% chance per request) */
export async function cleanupExpiredSessions(): Promise<void> {
  const db = getDb();
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

// ── Cookie helpers ──────────────────────────────────────────────────────

export function setSessionCookie(c: Context, sessionId: string): void {
  setCookie(c, SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000, // seconds
  });
}

export function getSessionCookie(c: Context): string | undefined {
  return getCookie(c, SESSION_COOKIE);
}

export function clearSessionCookie(c: Context): void {
  deleteCookie(c, SESSION_COOKIE, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "Lax",
    path: "/",
  });
}
