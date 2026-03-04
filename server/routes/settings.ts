/** @license SPDX-License-Identifier: Apache-2.0 */
import { Router } from "express";
import { getSettings, upsertSettings } from "../db/repositories/settings";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const settings = await getSettings(userId);
    res.json({ settings: settings || {} });
  } catch (err) { next(err); }
});

const ALLOWED_FIELDS = ["is_dark", "font_size", "default_mode", "default_intent", "default_audience", "default_platform"] as const;

router.put("/", async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    // Whitelist: only pick known fields from the body
    const clean: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in req.body) clean[key] = req.body[key];
    }
    const updated = await upsertSettings(userId, clean);
    res.json({ settings: updated });
  } catch (err) { next(err); }
});

export default router;
