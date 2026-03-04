/** @license SPDX-License-Identifier: Apache-2.0 */
import { getSql } from "../index";

export async function logUsage(params: {
  userId: number | null;
  action: string;
  mode?: string;
  platform?: string;
  inputLength?: number;
  outputLength?: number;
}): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO usage_stats (user_id, action, mode, platform, input_length, output_length)
    VALUES (${params.userId}, ${params.action}, ${params.mode || null}, ${params.platform || null},
            ${params.inputLength || null}, ${params.outputLength || null})
  `;
}
