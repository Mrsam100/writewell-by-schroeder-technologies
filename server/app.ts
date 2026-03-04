import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import type { Context } from "hono";
import { config } from "./config";
import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";
import historyRoutes from "./routes/history";
import settingsRoutes from "./routes/settings";
import { rateLimit } from "./middleware/rateLimit";
import { requireAuth } from "./middleware/auth";
import { csrfProtection } from "./auth/csrf";

export interface AppEnv {
  Variables: {
    user?: { userId: number; email: string };
  };
}

const app = new Hono<AppEnv>();

// Global middleware
app.use("*", cors({
  origin: config.corsOrigins,
  credentials: true,
}));
app.use("*", logger());
app.use("*", secureHeaders());

// Rate limit on /api
app.use("/api/*", rateLimit);

// Auth routes (no CSRF -- login/register are credential-based, rate-limited)
app.route("/api/auth", authRoutes);

// CSRF protection on authenticated mutation routes only.
// /api/rewrite and /api/analyse use optionalAuth (guests allowed) and guests
// have no CSRF cookie, so CSRF is NOT enforced on those endpoints.
app.use("/api/history/*", csrfProtection);
app.use("/api/history", csrfProtection);
app.use("/api/settings/*", csrfProtection);
app.use("/api/settings", csrfProtection);

// Protected routes
app.use("/api/history/*", requireAuth);
app.use("/api/history", requireAuth);
app.route("/api/history", historyRoutes);
app.use("/api/settings/*", requireAuth);
app.use("/api/settings", requireAuth);
app.route("/api/settings", settingsRoutes);
app.route("/api", apiRoutes);

// Global error handler
app.onError((err: Error, c: Context) => {
  console.error("[Error]", err.message);

  if (err.message?.includes("API key")) {
    return c.json({ error: "Invalid API key configuration." }, 401);
  }
  if (err.message?.includes("safety")) {
    return c.json({ error: "Content was flagged by safety filters. Please try different text." }, 422);
  }
  if (err.message?.includes("quota")) {
    return c.json({ error: "API quota exceeded. Please try again later." }, 429);
  }
  if (err.message?.includes("Failed to parse analysis response")) {
    return c.json({ error: "Model returned invalid data. Please try again." }, 502);
  }
  if (
    err.message?.includes("Bad escaped character in JSON") ||
    err.message?.includes("Unexpected token") ||
    err.message?.includes("Unexpected end of JSON") ||
    err.message?.includes("is not valid JSON")
  ) {
    return c.json({ error: "Invalid request body." }, 400);
  }

  // In dev: show error but truncate and strip sensitive patterns (URLs, credentials)
  let message = "An internal error occurred.";
  if (!config.isProduction) {
    message = (err.message || "Unknown error").slice(0, 200);
    // Strip anything that looks like a connection string or URL with credentials
    message = message.replace(/(?:postgres|mysql|https?):\/\/[^\s]+/gi, "[REDACTED_URL]");
  }

  return c.json({ error: message }, 500);
});

export default app;
