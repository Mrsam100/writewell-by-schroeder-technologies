import { serve } from "@hono/node-server";
import app from "./app";
import { config } from "./config";
import { ensureSchema } from "./db/migrate";

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
