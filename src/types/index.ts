/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnalysisIssue {
  type: "Grammar" | "Clarity" | "Tone" | "Structure" | "Wordiness";
  text: string;
  suggestion: string;
}

export interface AnalysisResult {
  readability: number;
  clarity: number;
  authority: number;
  engagement: number;
  detected_intent: string;
  detected_tone: string;
  word_count: number;
  sentence_count: number;
  avg_sentence_length: number;
  passive_voice_count: number;
  issues: AnalysisIssue[];
  banned_words: string[];
  summary: string;
  weakness: string;
}

export interface HistoryItem {
  id: number;
  input: string;
  input_full: string;
  output: string;
  mode: string;
  platform: string;
  date: string;
}
