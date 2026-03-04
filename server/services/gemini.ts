/** @license SPDX-License-Identifier: Apache-2.0 */
import { config } from "../config";
import { makeSystemPrompt, analysisPrompt } from "../prompts";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = ["google/gemini-2.0-flash-001", "google/gemini-flash-1.5"];

async function chatCompletion(
  messages: { role: string; content: string }[],
  json?: boolean
): Promise<string> {
  let lastError = "";

  for (const model of MODELS) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openrouterApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          ...(json ? { response_format: { type: "json_object" } } : {}),
        }),
      });

      if (!res.ok) {
        lastError = await res.text();
        console.error(`[AI] ${model} failed (${res.status}): ${lastError}`);
        continue;
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (e: any) {
      lastError = e.message;
      console.error(`[AI] ${model} error: ${lastError}`);
      continue;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError}`);
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
  try {
    return JSON.parse(result || "{}");
  } catch {
    throw new Error("Failed to parse analysis response from AI model.");
  }
}
