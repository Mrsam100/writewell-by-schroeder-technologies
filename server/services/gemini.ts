/** @license SPDX-License-Identifier: Apache-2.0 */
import { config } from "../config";
import { makeSystemPrompt, analysisPrompt } from "../prompts";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-001";

async function chatCompletion(
  messages: { role: string; content: string }[],
  json?: boolean
): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openrouterApiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function rewriteText(params: {
  input: string;
  mode: string;
  intent: string;
  audience: string;
  platform: string;
  customVoice: string;
}): Promise<string> {
  const systemPrompt = makeSystemPrompt(
    params.mode, params.intent, params.audience, params.platform, params.customVoice
  );
  const result = await chatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: params.input },
  ]);
  return result || "Error generating rewrite.";
}

export async function analyseText(input: string) {
  const result = await chatCompletion(
    [{ role: "user", content: analysisPrompt(input) }],
    true
  );
  return JSON.parse(result || "{}");
}
