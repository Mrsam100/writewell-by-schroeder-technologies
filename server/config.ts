import dotenv from "dotenv";
if (!process.env.VERCEL) dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  openrouterApiKey: process.env.OPENROUTER_API_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
  corsOrigins: (process.env.CORS_ORIGINS || "*").split(","),
  sessionSecret: process.env.SESSION_SECRET || "writewell-dev-session-secret",
  rateLimit: {
    windowMs: 60_000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "20", 10),
  },
  isProduction: process.env.NODE_ENV === "production",
};
