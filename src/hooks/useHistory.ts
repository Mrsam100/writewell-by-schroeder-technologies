/** @license SPDX-License-Identifier: Apache-2.0 */
import { useState, useEffect } from "react";
import type { HistoryItem } from "../types";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("writewell_history_v1");
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const addToHistory = (item: HistoryItem, currentHistory: HistoryItem[]) => {
    const next = [item, ...currentHistory].slice(0, 20);
    setHistory(next);
    localStorage.setItem("writewell_history_v1", JSON.stringify(next));
    return next;
  };

  return { history, setHistory, addToHistory };
}
