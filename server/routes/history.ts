import { Hono } from "hono";
import type { AppEnv } from "../app";
import { getHistory, deleteHistoryItem, clearHistory } from "../db/repositories/history";

const historyRoutes = new Hono<AppEnv>();

historyRoutes.get("/", async (c) => {
  const user = c.get("user")!;
  const limitParam = c.req.query("limit");
  const limit = Math.min(Math.max(parseInt(limitParam || "50") || 50, 1), 200);
  const items = await getHistory(user.userId, limit);
  return c.json({ history: items });
});

historyRoutes.delete("/:id", async (c) => {
  const user = c.get("user")!;
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
  const deleted = await deleteHistoryItem(id, user.userId);
  return c.json({ deleted });
});

historyRoutes.delete("/", async (c) => {
  const user = c.get("user")!;
  const count = await clearHistory(user.userId);
  return c.json({ cleared: count });
});

export default historyRoutes;
