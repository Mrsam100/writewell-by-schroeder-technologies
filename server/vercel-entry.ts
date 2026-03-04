import { handle } from "hono/vercel";
import app from "./app";
import { ensureSchema } from "./db/migrate";

// Run schema init in background -- don't block requests.
// Tables already exist; this is just a safety net.
ensureSchema()
  .then(() => console.log("[Vercel] Schema ready"))
  .catch((err) => console.error("[Vercel] DB init failed:", err.message));

export default handle(app);
