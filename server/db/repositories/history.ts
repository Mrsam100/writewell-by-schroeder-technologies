import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../index";
import { history } from "../schema";

export async function getHistory(userId: number, limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(history)
    .where(eq(history.userId, userId))
    .orderBy(desc(history.createdAt))
    .limit(limit);
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
}) {
  const db = getDb();
  const rows = await db
    .insert(history)
    .values({
      userId: params.userId,
      input: params.input,
      inputFull: params.inputFull,
      output: params.output,
      mode: params.mode,
      platform: params.platform,
      intent: params.intent,
      audience: params.audience,
      customVoice: params.customVoice,
    })
    .returning();
  return rows[0];
}

export async function deleteHistoryItem(id: number, userId: number): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .delete(history)
    .where(and(eq(history.id, id), eq(history.userId, userId)))
    .returning({ id: history.id });
  return rows.length > 0;
}

export async function clearHistory(userId: number): Promise<number> {
  const db = getDb();
  const rows = await db
    .delete(history)
    .where(eq(history.userId, userId))
    .returning({ id: history.id });
  return rows.length;
}
