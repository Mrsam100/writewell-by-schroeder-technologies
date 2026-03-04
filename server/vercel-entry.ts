import { handle } from "hono/vercel";
import app from "./app";
import { ensureSchema } from "./db/migrate";

// Ensure DB schema on cold start (idempotent)
let schemaReady: Promise<void> | null = null;
function warmup() {
  if (!schemaReady) {
    schemaReady = ensureSchema().catch((err) => {
      console.error("[Vercel] DB init failed:", err.message);
      schemaReady = null; // Retry on next invocation
      throw err;
    });
  }
  return schemaReady;
}

const handler = handle(app);

export default async function (req: Request) {
  await warmup();
  return handler(req);
}
