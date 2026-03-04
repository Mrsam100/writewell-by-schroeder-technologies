/** @license SPDX-License-Identifier: Apache-2.0 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/app";
import { initDb } from "../server/db/index";

let dbInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }
    return app(req as any, res as any);
  } catch (err: any) {
    console.error("[Vercel Handler Error]", err);
    // Always return JSON so the client can parse it
    if (!res.headersSent) {
      res.status(500).json({
        error: process.env.NODE_ENV === "production"
          ? "A server error occurred. Please try again."
          : err.message || "Unknown server error",
      });
    }
  }
}
