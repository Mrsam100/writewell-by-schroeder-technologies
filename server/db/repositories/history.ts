/** @license SPDX-License-Identifier: Apache-2.0 */
import { getSql } from "../index";

export interface HistoryRow {
  id: number;
  user_id: number | null;
  input: string;
  input_full: string;
  output: string;
  mode: string;
  platform: string;
  intent: string;
  audience: string;
  custom_voice: string;
  created_at: string;
}

export async function getHistory(userId: number, limit = 50): Promise<HistoryRow[]> {
  const sql = getSql();
  return await sql`
    SELECT * FROM history WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}
  ` as HistoryRow[];
}

export async function addHistory(params: {
  userId: number;
  input: string;
  inputFull: string;
  output: string;
  mode: string;
  platform: string;
  intent: string;
  audience: string;
  customVoice: string;
}): Promise<HistoryRow> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO history (user_id, input, input_full, output, mode, platform, intent, audience, custom_voice)
    VALUES (${params.userId}, ${params.input}, ${params.inputFull}, ${params.output},
            ${params.mode}, ${params.platform}, ${params.intent}, ${params.audience}, ${params.customVoice})
    RETURNING *
  `;
  return rows[0] as HistoryRow;
}

export async function deleteHistoryItem(id: number, userId: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM history WHERE id = ${id} AND user_id = ${userId} RETURNING id`;
  return rows.length > 0;
}

export async function clearHistory(userId: number): Promise<number> {
  const sql = getSql();
  const rows = await sql`DELETE FROM history WHERE user_id = ${userId} RETURNING id`;
  return rows.length;
}
