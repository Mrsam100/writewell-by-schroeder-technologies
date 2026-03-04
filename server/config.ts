/** @license SPDX-License-Identifier: Apache-2.0 */
import dotenv from "dotenv";
if (!process.env.VERCEL) dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
  corsOrigins: (process.env.CORS_ORIGINS || "*").split(","),
  jwtSecret: process.env.JWT_SECRET || "writewell-dev-secret-change-in-production",
  rateLimit: {
    windowMs: 60_000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "20", 10),
  },
};
