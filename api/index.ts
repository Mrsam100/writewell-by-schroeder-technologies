/** @license SPDX-License-Identifier: Apache-2.0 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Tell Vercel NOT to parse the body — let Express handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

let app: any = null;
let dbReady = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Dynamic imports so module-level crashes are caught by this try-catch
    if (!app) {
      const appMod = await import("../server/app");
      app = appMod.default;
    }

    if (!dbReady) {
      const { initDb } = await import("../server/db/index");
      await initDb();
      dbReady = true;
    }

    // Wrap in a promise so Express errors are caught
    await new Promise<void>((resolve, reject) => {
      try {
        app(req as any, res as any);
        res.on("finish", resolve);
        res.on("error", reject);
      } catch (e) {
        reject(e);
      }
    });
  } catch (err: any) {
    console.error("[Vercel Handler Error]", err?.message || err, err?.stack);
    if (!res.headersSent) {
      res.status(500).json({
        error: "A server error occurred. Please try again.",
        debug: err?.message || String(err),
      });
    }
  }
}
