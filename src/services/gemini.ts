/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AnalysisResult } from "../types";

/** Read the CSRF token from the cookie */
function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)writewell_csrf=([^;]+)/);
  return match ? match[1] : "";
}

async function apiFetch<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-CSRF-Token": getCsrfToken(),
  };

  let res: Response;
  try {
    res = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });
  } catch (networkErr: any) {
    throw new Error(`Network error: ${networkErr.message}. Is the server running?`);
  }

  const text = await res.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
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
