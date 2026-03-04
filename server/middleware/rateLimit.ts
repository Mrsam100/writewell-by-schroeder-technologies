import { createMiddleware } from "hono/factory";
import { config } from "../config";

function createLimiter(windowMs: number, maxRequests: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  // Cleanup every 5 minutes
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }
  }, 5 * 60_000);
  if (typeof timer === "object" && "unref" in timer) timer.unref();

  return createMiddleware(async (c, next) => {
    const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim()
      || c.req.header("x-real-ip")
      || "unknown";
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    entry.count++;
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      c.header("Retry-After", String(retryAfter));
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }

    await next();
  });
}

/** General API rate limit: 20 req/min */
export const rateLimit = createLimiter(config.rateLimit.windowMs, config.rateLimit.maxRequests);

/** Auth-specific brute-force protection: 10 attempts per 15 minutes */
export const authRateLimit = createLimiter(15 * 60_000, 10);
