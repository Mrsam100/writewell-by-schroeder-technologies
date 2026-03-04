import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { config } from "../config";

let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not configured. Set it in your environment variables.");
  }
  const sql = neon(config.databaseUrl);
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
}

export type Database = ReturnType<typeof getDb>;
