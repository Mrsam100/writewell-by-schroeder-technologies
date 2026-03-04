/** @license SPDX-License-Identifier: Apache-2.0 */
import { getSql } from "../index";

export interface SettingsRow {
  user_id: number;
  is_dark: boolean;
  font_size: number;
  default_mode: string;
  default_intent: string;
  default_audience: string;
  default_platform: string;
}

export async function getSettings(userId: number): Promise<SettingsRow | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM settings WHERE user_id = ${userId}`;
  return (rows[0] as SettingsRow) || null;
}

export async function upsertSettings(userId: number, settings: Partial<Omit<SettingsRow, "user_id">>): Promise<SettingsRow> {
  const sql = getSql();

  const isDark = settings.is_dark ?? false;
  const fontSize = Math.min(Math.max(settings.font_size ?? 18, 10), 32);
  const defaultMode = settings.default_mode ?? "CLARITY";
  const defaultIntent = settings.default_intent ?? "Persuade";
  const defaultAudience = settings.default_audience ?? "LinkedIn Connections";
  const defaultPlatform = settings.default_platform ?? "LinkedIn Post";

  // Atomic upsert -- no race condition
  await sql`
    INSERT INTO settings (user_id, is_dark, font_size, default_mode, default_intent, default_audience, default_platform)
    VALUES (${userId}, ${isDark}, ${fontSize}, ${defaultMode}, ${defaultIntent}, ${defaultAudience}, ${defaultPlatform})
    ON CONFLICT (user_id) DO UPDATE SET
      is_dark = ${isDark},
      font_size = ${fontSize},
      default_mode = ${defaultMode},
      default_intent = ${defaultIntent},
      default_audience = ${defaultAudience},
      default_platform = ${defaultPlatform}
  `;

  return (await getSettings(userId))!;
}
