import { Hono } from "hono";
import type { AppEnv } from "../app";
import { rewriteText, analyseText } from "../services/openrouter";
import { rewriteSchema, analyseSchema } from "../middleware/validate";
import { addHistory } from "../db/repositories/history";
import { logUsage } from "../db/repositories/usage";
import { optionalAuth } from "../middleware/auth";

const api = new Hono<AppEnv>();

api.post("/rewrite", optionalAuth, async (c) => {
  const body = await c.req.json();
  const parsed = rewriteSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { input, mode, intent, audience, platform, customVoice } = parsed.data;

  const result = await rewriteText({
    input,
    mode,
    intent,
    audience,
    platform,
    customVoice,
  });

  // Save history + log usage before returning (Vercel kills the function after response)
  const user = c.get("user");
  try {
    if (user) {
      await addHistory({
        userId: user.userId,
        input: input.substring(0, 200),
        inputFull: input,
        output: result,
        mode,
        platform,
        intent,
        audience,
        customVoice,
      });
    }
    await logUsage({
      userId: user?.userId ?? null,
      action: "rewrite",
      mode,
      platform,
      inputLength: input.length,
      outputLength: result.length,
    });
  } catch (dbErr) {
    console.error("[DB] Failed to log rewrite:", (dbErr as Error).message);
  }

  return c.json({ result });
});

api.post("/analyse", optionalAuth, async (c) => {
  const body = await c.req.json();
  const parsed = analyseSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { input } = parsed.data;
  const result = await analyseText(input);

  // Log usage before returning (Vercel kills the function after response)
  const user = c.get("user");
  try {
    await logUsage({
      userId: user?.userId ?? null,
      action: "analyse",
      inputLength: input.length,
    });
  } catch (dbErr) {
    console.error("[DB] Failed to log analysis:", (dbErr as Error).message);
  }

  return c.json({ result });
});

api.get("/health", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});

export default api;
