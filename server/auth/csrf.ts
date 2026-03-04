import crypto from "crypto";
import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";
import { config } from "../config";
import type { Context } from "hono";

const CSRF_COOKIE = "writewell_csrf";
const CSRF_HEADER = "x-csrf-token";

/** Generate and set a new CSRF cookie (call on auth state change to prevent fixation) */
export function rotateCsrfCookie(c: Context): void {
  const token = crypto.randomBytes(32).toString("hex");
  setCookie(c, CSRF_COOKIE, token, {
    httpOnly: false, // Must be readable by JS
    secure: config.isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/** Set a CSRF cookie if not already present */
export function ensureCsrfCookie(c: Context): void {
  if (!getCookie(c, CSRF_COOKIE)) {
    rotateCsrfCookie(c);
  }
}

/** Constant-time string comparison to prevent timing side-channel attacks */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

/**
 * Double-submit cookie CSRF middleware.
 * Only enforced on mutation methods (POST, PUT, PATCH, DELETE).
 * Uses constant-time comparison to prevent timing side-channel attacks.
 */
export const csrfProtection = createMiddleware(async (c, next) => {
  const method = c.req.method.toUpperCase();

  // Always ensure the CSRF cookie exists (even on GET)
  ensureCsrfCookie(c);

  // Only validate on mutations
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const cookieToken = getCookie(c, CSRF_COOKIE);
    const headerToken = c.req.header(CSRF_HEADER);

    if (!cookieToken || !headerToken || !timingSafeCompare(cookieToken, headerToken)) {
      return c.json({ error: "CSRF validation failed." }, 403);
    }
  }

  await next();
});
