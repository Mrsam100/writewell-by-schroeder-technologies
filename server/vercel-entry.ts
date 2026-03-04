import { handle } from "hono/vercel";
import app from "./app";

// Tables already exist in Neon -- no need to run ensureSchema() on Vercel.
// Skipping it avoids 12 DB queries on every cold start (saves 3-5s when Neon is cold).

export default handle(app);
