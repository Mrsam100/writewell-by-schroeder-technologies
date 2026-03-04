import { z } from "zod";

const stripControlChars = (s: string) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

const VALID_MODES = ["CLARITY", "AUTHORITY", "PERSUASION", "WARMTH", "CONCISION", "EXECUTIVE"] as const;
const VALID_INTENTS = ["Persuade", "Inform", "Instruct", "Sell", "Network", "Report"] as const;

export const rewriteSchema = z.object({
  input: z.string().min(1, "Input text is required.").max(10_000, "Input exceeds maximum length of 10000 characters.").transform(stripControlChars),
  mode: z.enum(VALID_MODES).optional().default("CLARITY"),
  intent: z.enum(VALID_INTENTS).optional().default("Persuade"),
  audience: z.string().max(200).optional().default("General Public").transform(s => stripControlChars(s).slice(0, 200)),
  platform: z.string().max(200).optional().default("General").transform(s => stripControlChars(s).slice(0, 200)),
  customVoice: z.string().max(500).optional().default("").transform(s => stripControlChars(s).slice(0, 500)),
});

export const analyseSchema = z.object({
  input: z.string().min(1, "Input text is required.").max(10_000, "Input exceeds maximum length of 10000 characters.").transform(stripControlChars),
});
