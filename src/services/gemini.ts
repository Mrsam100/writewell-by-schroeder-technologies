/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AnalysisResult } from "../types";

async function apiFetch<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const token = localStorage.getItem("writewell_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  const data = await res.json();
  return data.result;
}

export async function rewriteText(params: {
  input: string;
  mode: string;
  intent: string;
  audience: string;
  platform: string;
  customVoice: string;
}): Promise<string> {
  return apiFetch<string>("/rewrite", params);
}

export async function analyseText(input: string): Promise<AnalysisResult> {
  return apiFetch<AnalysisResult>("/analyse", { input });
}
