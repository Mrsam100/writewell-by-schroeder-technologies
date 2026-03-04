import OpenAI from "openai";
import { config } from "../config";
import { makeSystemPrompt, analysisPrompt } from "../prompts";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openrouterApiKey,
});

const PRIMARY_MODEL = "google/gemini-2.0-flash-001";
const FALLBACK_MODEL = "google/gemini-flash-1.5";

async function chatCompletion(
  messages: OpenAI.ChatCompletionMessageParam[],
  options?: { json?: boolean }
): Promise<string> {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: Error | null = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const completion = await client.chat.completions.create({
          model,
          messages,
          temperature: 0.7,
          ...(options?.json ? { response_format: { type: "json_object" } } : {}),
        }, { timeout: 8000 });
        return completion.choices[0]?.message?.content || "";
      } catch (err: any) {
        lastError = err;
        // Don't retry on 4xx errors (except 429 rate limit)
        if (err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
          break; // Skip to next model
        }
        // Brief backoff before retry
        if (attempt < 1) {
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message || "Unknown"}`);
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
    params.mode,
    params.intent,
    params.audience,
    params.platform,
    params.customVoice
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
    { json: true }
  );
  try {
    return JSON.parse(result || "{}");
  } catch {
    throw new Error("Failed to parse analysis response from AI model.");
  }
}
