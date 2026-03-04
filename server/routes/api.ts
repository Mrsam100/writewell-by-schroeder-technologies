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

    // Save to history only if user is authenticated
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

    // Log usage
    await logUsage({
      userId: req.user?.userId || null,
      action: "rewrite",
      mode: rewriteMode,
      platform: rewritePlatform,
      inputLength: input.length,
      outputLength: result.length,
    });

    res.json({ result });
  } catch (err) {
    next(err);
  }
});

router.post("/analyse", optionalAuth, validateAnalyse, async (req, res, next) => {
  try {
    const result = await analyseText(req.body.input);

    // Log usage
    await logUsage({
      userId: req.user?.userId || null,
      action: "analyse",
      inputLength: req.body.input.length,
    });

    res.json({ result });
  } catch (err) {
    next(err);
  }
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

export default router;
