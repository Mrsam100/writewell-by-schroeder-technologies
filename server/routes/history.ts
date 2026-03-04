/** @license SPDX-License-Identifier: Apache-2.0 */
import { Router } from "express";
import { getHistory, deleteHistoryItem, clearHistory } from "../db/repositories/history";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 200);
    const items = await getHistory(userId, limit);
    res.json({ history: items });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const deleted = await deleteHistoryItem(id, userId);
    res.json({ deleted });
  } catch (err) { next(err); }
});

router.delete("/", async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const count = await clearHistory(userId);
    res.json({ cleared: count });
  } catch (err) { next(err); }
});

export default router;
