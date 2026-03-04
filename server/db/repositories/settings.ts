import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { settings } from "../schema";

export async function getSettings(userId: number) {
  const db = getDb();
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, userId))
    .limit(1);
  return rows[0] || null;
}

export async function upsertSettings(
  userId: number,
  data: Record<string, unknown>
) {
  const db = getDb();

  const isDark = typeof data.is_dark === "boolean" ? data.is_dark : false;
  const fontSize = Math.min(Math.max(typeof data.font_size === "number" ? data.font_size : 18, 10), 32);
  const defaultMode = typeof data.default_mode === "string" ? data.default_mode : "CLARITY";
  const defaultIntent = typeof data.default_intent === "string" ? data.default_intent : "Persuade";
  const defaultAudience = typeof data.default_audience === "string" ? data.default_audience : "LinkedIn Connections";
  const defaultPlatform = typeof data.default_platform === "string" ? data.default_platform : "LinkedIn Post";

  const values = {
    userId,
    isDark,
    fontSize,
    defaultMode,
    defaultIntent,
    defaultAudience,
    defaultPlatform,
  };

  await db
    .insert(settings)
    .values(values)
    .onConflictDoUpdate({
      target: settings.userId,
      set: {
        isDark,
        fontSize,
        defaultMode,
        defaultIntent,
        defaultAudience,
        defaultPlatform,
      },
    });

  return (await getSettings(userId))!;
}
