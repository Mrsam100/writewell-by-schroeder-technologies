/** @license SPDX-License-Identifier: Apache-2.0 */
import { useEffect } from "react";

export function useKeyboardShortcuts(handlers: {
  onRewrite: () => void;
  onToggleHistory: () => void;
  onCopy: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key === "Enter") {
        e.preventDefault();
        handlers.onRewrite();
      }
      if (isMod && e.key === "h") {
        e.preventDefault();
        handlers.onToggleHistory();
      }
      if (isMod && e.shiftKey && e.key === "C") {
        e.preventDefault();
        handlers.onCopy();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers.onRewrite, handlers.onToggleHistory, handlers.onCopy]);
}
