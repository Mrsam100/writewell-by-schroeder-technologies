/** @license SPDX-License-Identifier: Apache-2.0 */
import type { Request, Response, NextFunction } from "express";
import { config } from "../config";

function createLimiter(windowMs: number, maxRequests: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  // Cleanup every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }
  }, 5 * 60_000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    next();
  };
}

/** General API rate limit: 20 req/min */
export const rateLimit = createLimiter(config.rateLimit.windowMs, config.rateLimit.maxRequests);

/** Auth-specific brute-force protection: 5 attempts per 15 minutes */
export const authRateLimit = createLimiter(15 * 60_000, 5);
