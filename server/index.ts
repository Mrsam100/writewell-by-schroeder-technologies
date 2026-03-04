/** @license SPDX-License-Identifier: Apache-2.0 */
import path from "path";
import express from "express";
import app from "./app";
import { config } from "./config";
import { initDb } from "./db/index";

// Serve static files in production (non-Vercel)
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const distPath = path.resolve(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Initialize DB then start server
initDb().then(() => {
  app.listen(config.port, () => {
    console.log(`[WriteWell] Server running on port ${config.port}`);
  });
}).catch((err) => {
  console.error("[WriteWell] Failed to initialize database:", err);
  process.exit(1);
});
