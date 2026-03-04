import { Hono } from "hono";
import type { AppEnv } from "../app";
import { getSettings, upsertSettings } from "../db/repositories/settings";

const settingsRoutes = new Hono<AppEnv>();

// Map camelCase frontend keys → snake_case DB keys
const FIELD_MAP: Record<string, string> = {
  isDark: "is_dark",
  fontSize: "font_size",
  defaultMode: "default_mode",
  defaultIntent: "default_intent",
  defaultAudience: "default_audience",
  defaultPlatform: "default_platform",
};

settingsRoutes.get("/", async (c) => {
  const user = c.get("user")!;
  const result = await getSettings(user.userId);
  return c.json({ settings: result || {} });
});

settingsRoutes.put("/", async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  const clean: Record<string, unknown> = {};
  for (const [camel, snake] of Object.entries(FIELD_MAP)) {
    if (camel in body) clean[snake] = body[camel];
  }
  const updated = await upsertSettings(user.userId, clean);
  return c.json({ settings: updated });
});

export default settingsRoutes;
