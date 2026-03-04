import { getDb } from "../index";
import { usageStats } from "../schema";

export async function logUsage(params: {
  userId: number | null;
  action: string;
  mode?: string;
  platform?: string;
  inputLength?: number;
  outputLength?: number;
}): Promise<void> {
  const db = getDb();
  await db.insert(usageStats).values({
    userId: params.userId,
    action: params.action,
    mode: params.mode || null,
    platform: params.platform || null,
    inputLength: params.inputLength || null,
    outputLength: params.outputLength || null,
  });
}
