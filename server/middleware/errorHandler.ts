/** @license SPDX-License-Identifier: Apache-2.0 */
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err.message);

  if (err.message?.includes("API key")) {
    return res.status(401).json({ error: "Invalid API key configuration." });
  }
  if (err.message?.includes("safety")) {
    return res.status(422).json({ error: "Content was flagged by safety filters. Please try different text." });
  }
  if (err.message?.includes("quota")) {
    return res.status(429).json({ error: "API quota exceeded. Please try again later." });
  }
  if (err.message?.includes("JSON")) {
    return res.status(502).json({ error: "Model returned invalid data. Please try again." });
  }

  const status = (err as any).status || 500;
  const message = process.env.NODE_ENV === "production"
    ? "An internal error occurred."
    : err.message;

  res.status(status).json({ error: message });
};
