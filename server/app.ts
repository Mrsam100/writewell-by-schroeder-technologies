/** @license SPDX-License-Identifier: Apache-2.0 */
import express from "express";
import cors from "cors";
import { config } from "./config";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import { rateLimit } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { securityHeaders } from "./middleware/security";
import { requestLogger } from "./middleware/logger";

const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(securityHeaders);
app.use(requestLogger);
app.use(express.json({ limit: "50kb" }));
app.use("/api", rateLimit);
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use(errorHandler);

export default app;
