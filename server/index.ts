import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./app";
import { config } from "./config";
import { ensureSchema } from "./db/migrate";

// In production (non-Vercel), serve the built frontend
if (config.isProduction && !process.env.VERCEL) {
  app.use("/*", serveStatic({ root: "./dist" }));
  // SPA fallback: serve index.html for all non-API routes
  app.get("*", serveStatic({ path: "./dist/index.html" }));
}

// Initialize DB schema, then start server
ensureSchema()
  .then(() => {
    serve({ fetch: app.fetch, port: config.port }, (info) => {
      console.log(`[WriteWell] Server running on port ${info.port}`);
    });
  })
  .catch((err) => {
    console.error("[WriteWell] Failed to initialize database:", err.message);
    process.exit(1);
  });
