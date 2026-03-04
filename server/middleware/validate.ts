/** @license SPDX-License-Identifier: Apache-2.0 */
import type { Request, Response, NextFunction } from "express";

const VALID_MODES = ["CLARITY", "AUTHORITY", "PERSUASION", "WARMTH", "CONCISION", "EXECUTIVE"];
const VALID_INTENTS = ["Persuade", "Inform", "Instruct", "Sell", "Network", "Report"];
const MAX_INPUT_LENGTH = 10_000;

const stripControlChars = (s: string) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

export const validateRewrite = (req: Request, res: Response, next: NextFunction) => {
  const { input, mode, intent, audience, platform } = req.body;

  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({ error: "Input text is required." });
  }
  if (input.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({ error: `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters.` });
  }
  if (mode && !VALID_MODES.includes(mode)) {
    return res.status(400).json({ error: `Invalid mode. Must be one of: ${VALID_MODES.join(", ")}` });
  }
  if (intent && !VALID_INTENTS.includes(intent)) {
    return res.status(400).json({ error: `Invalid intent. Must be one of: ${VALID_INTENTS.join(", ")}` });
  }

  req.body.input = stripControlChars(input);
  if (typeof audience === "string") req.body.audience = stripControlChars(audience).slice(0, 200);
  if (typeof platform === "string") req.body.platform = stripControlChars(platform).slice(0, 200);
  if (typeof req.body.customVoice === "string") req.body.customVoice = stripControlChars(req.body.customVoice).slice(0, 500);

  next();
};

export const validateAnalyse = (req: Request, res: Response, next: NextFunction) => {
  const { input } = req.body;

  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({ error: "Input text is required." });
  }
  if (input.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({ error: `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters.` });
  }

  req.body.input = stripControlChars(input);
  next();
};
