/** @license SPDX-License-Identifier: Apache-2.0 */
import { useState } from "react";
import { C } from "../constants";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const theme = {
    bg: isDark ? "#0a0a0a" : C.bg,
    s1: isDark ? "#141414" : "#f8f9fa",
    text: isDark ? "#f8f9fa" : "#1a1a1a",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    muted: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
    dim: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
    card: isDark ? "#1a1a1a" : "#ffffff",
  };
  return { isDark, setIsDark, theme };
}

export type Theme = ReturnType<typeof useTheme>["theme"];
