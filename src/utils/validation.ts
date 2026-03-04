/** @license SPDX-License-Identifier: Apache-2.0 */
export const MAX_INPUT_LENGTH = 10_000;

export const validateInput = (input: string): string | null => {
  if (!input.trim()) return "Please enter some text to rewrite.";
  if (input.length > MAX_INPUT_LENGTH) return `Input exceeds maximum of ${MAX_INPUT_LENGTH.toLocaleString()} characters.`;
  return null;
};
