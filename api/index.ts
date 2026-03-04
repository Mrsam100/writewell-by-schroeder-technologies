/** @license SPDX-License-Identifier: Apache-2.0 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/app";
import { initDb } from "../server/db/index";

let dbInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
  return app(req as any, res as any);
}
