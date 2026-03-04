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

  // Fire-and-forget DB writes -- return the result immediately.
  // On Vercel serverless these may be lost, but the alternative is a 504 timeout.
  const user = c.get("user");
  if (user) {
    addHistory({
      userId: user.userId,
      input: input.substring(0, 200),
      inputFull: input,
      output: result,
      mode,
      platform,
      intent,
      audience,
      customVoice,
    }).catch((e) => console.error("[DB] history:", e.message));
  }
  logUsage({
    userId: user?.userId ?? null,
    action: "rewrite",
    mode,
    platform,
    inputLength: input.length,
    outputLength: result.length,
  }).catch((e) => console.error("[DB] usage:", e.message));

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

  // Fire-and-forget
  const user = c.get("user");
  logUsage({
    userId: user?.userId ?? null,
    action: "analyse",
    inputLength: input.length,
  }).catch((e) => console.error("[DB] usage:", e.message));

  return c.json({ result });
});

api.get("/health", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});

export default api;
