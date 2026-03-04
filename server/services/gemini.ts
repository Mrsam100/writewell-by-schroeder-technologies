/** @license SPDX-License-Identifier: Apache-2.0 */
import { GoogleGenAI } from "@google/genai";
import { config } from "../config";
import { makeSystemPrompt, analysisPrompt } from "../prompts";

const getAI = () => new GoogleGenAI({ apiKey: config.geminiApiKey });

export async function rewriteText(params: {
  input: string;
  mode: string;
  intent: string;
  audience: string;
  platform: string;
  customVoice: string;
}): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: params.input,
    config: {
      systemInstruction: makeSystemPrompt(
        params.mode, params.intent, params.audience, params.platform, params.customVoice
      ),
      temperature: 0.7,
    },
  });
  return response.text || "Error generating rewrite.";
}

export async function analyseText(input: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: analysisPrompt(input),
    config: {
      responseMimeType: "application/json",
    },
  });
  return JSON.parse(response.text || "{}");
}
