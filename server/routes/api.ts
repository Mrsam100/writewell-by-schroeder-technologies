/** @license SPDX-License-Identifier: Apache-2.0 */
import { Router } from "express";
import { rewriteText, analyseText } from "../services/gemini";
import { validateRewrite, validateAnalyse } from "../middleware/validate";
import { addHistory } from "../db/repositories/history";
import { logUsage } from "../db/repositories/usage";
import { optionalAuth, authenticate } from "../middleware/auth";
import historyRoutes from "./history";
import settingsRoutes from "./settings";

const router = Router();

router.use("/history", authenticate, historyRoutes);
router.use("/settings", authenticate, settingsRoutes);

router.post("/rewrite", optionalAuth, validateRewrite, async (req, res, next) => {
  try {
    const { input, mode, intent, audience, platform, customVoice } = req.body;
    const rewriteMode = mode || "CLARITY";
    const rewritePlatform = platform || "General";
    const rewriteIntent = intent || "Persuade";
    const rewriteAudience = audience || "General Public";
    const rewriteVoice = customVoice || "";

    const result = await rewriteText({
      input,
      mode: rewriteMode,
      intent: rewriteIntent,
      audience: rewriteAudience,
      platform: rewritePlatform,
      customVoice: rewriteVoice,
    });

    // Send response immediately — don't let DB failures block the user
    res.json({ result });

    // Fire-and-forget: save history + log usage
    try {
      if (req.user) {
        await addHistory({
          userId: req.user.userId,
          input: input.substring(0, 200),
          inputFull: input,
          output: result,
          mode: rewriteMode,
          platform: rewritePlatform,
          intent: rewriteIntent,
          audience: rewriteAudience,
          customVoice: rewriteVoice,
        });
      }
      await logUsage({
        userId: req.user?.userId ?? null,
        action: "rewrite",
        mode: rewriteMode,
        platform: rewritePlatform,
        inputLength: input.length,
        outputLength: result.length,
      });
    } catch (dbErr) {
      console.error("[DB] Failed to log rewrite:", (dbErr as Error).message);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/analyse", optionalAuth, validateAnalyse, async (req, res, next) => {
  try {
    const result = await analyseText(req.body.input);

    // Send response immediately
    res.json({ result });

    // Fire-and-forget: log usage
    logUsage({
      userId: req.user?.userId ?? null,
      action: "analyse",
      inputLength: req.body.input.length,
    }).catch(dbErr => console.error("[DB] Failed to log analysis:", (dbErr as Error).message));
  } catch (err) {
    next(err);
  }
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

export default router;
