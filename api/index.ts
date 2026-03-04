/** @license SPDX-License-Identifier: Apache-2.0 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/app";
import { initDb } from "../server/db/index";

// Tell Vercel not to pre-parse request body (let Express handle it)
export const config = {
  api: { bodyParser: false },
};

let dbReady = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!dbReady) {
      await initDb();
      dbReady = true;
    }

    // Wrap Express in a promise to catch async errors
    await new Promise<void>((resolve, reject) => {
      res.on("finish", resolve);
      res.on("error", reject);
      app(req as any, res as any);
    });
  } catch (err: any) {
    console.error("[Vercel Handler Error]", err?.message || err, err?.stack);
    if (!res.headersSent) {
      res.status(500).json({
        error: `[DEBUG] ${err?.message || String(err)}`,
      });
    }
  }
}
