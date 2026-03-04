import { getRequestListener } from "@hono/node-server";
import type { IncomingMessage, ServerResponse } from "node:http";
import app from "./app";

// Use @hono/node-server to convert Node.js IncomingMessage/ServerResponse
// to Web API Request/Response. Vercel's @vercel/node passes (req, res) in
// Node.js format -- hono/vercel's handle() expects Web API Request which
// fails with "this.raw.headers.get is not a function" in CJS bundles.
const listener = getRequestListener(app.fetch);

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return listener(req, res);
}
