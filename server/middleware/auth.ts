import { createMiddleware } from "hono/factory";
import { getSessionCookie, clearSessionCookie, validateSession, cleanupExpiredSessions } from "../auth/session";
import { ensureCsrfCookie } from "../auth/csrf";
import { findById } from "../db/repositories/users";

export interface AuthPayload {
  userId: number;
  email: string;
}

export const requireAuth = createMiddleware(async (c, next) => {
  const sessionId = getSessionCookie(c);
  if (!sessionId) {
    ensureCsrfCookie(c);
    return c.json({ error: "Authentication required." }, 401);
  }

  const session = await validateSession(sessionId);
  if (!session) {
    // Clear the invalid/expired cookie so browser stops resending it
    clearSessionCookie(c);
    ensureCsrfCookie(c);
    return c.json({ error: "Session expired. Please log in again." }, 401);
  }

  const user = await findById(session.userId);
  if (!user) {
    clearSessionCookie(c);
    return c.json({ error: "User not found." }, 401);
  }

  c.set("user", { userId: user.id, email: user.email });

  // Probabilistic session cleanup (~1% of authenticated requests)
  if (Math.random() < 0.01) {
    cleanupExpiredSessions().catch((err) =>
      console.error("[Auth] Session cleanup failed:", err.message)
    );
  }

  await next();
});

export const optionalAuth = createMiddleware(async (c, next) => {
  const sessionId = getSessionCookie(c);
  if (sessionId) {
    try {
      const session = await validateSession(sessionId);
      if (session) {
        const user = await findById(session.userId);
        if (user) {
          c.set("user", { userId: user.id, email: user.email });
        }
      } else {
        // Clear expired cookie silently
        clearSessionCookie(c);
      }
    } catch {
      // Invalid session -- continue without auth
    }
  }
  await next();
});
