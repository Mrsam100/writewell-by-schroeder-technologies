/** @license SPDX-License-Identifier: Apache-2.0 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { config } from "../config";

let sql: NeonQueryFunction<false, false> | null = null;

export function getSql() {
  if (sql) return sql;
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not configured. Set it in your environment variables.");
  }
  sql = neon(config.databaseUrl);
  return sql;
}

let initPromise: Promise<void> | null = null;

/** Idempotent, concurrency-safe schema init. Resets on failure so next call retries. */
export function initDb(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = doInitDb().catch((err) => {
    // Reset so the next invocation retries instead of caching the failure
    initPromise = null;
    throw err;
  });
  return initPromise;
}

async function doInitDb() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      input TEXT NOT NULL,
      input_full TEXT NOT NULL,
      output TEXT NOT NULL,
      mode TEXT NOT NULL,
      platform TEXT DEFAULT '',
      intent TEXT DEFAULT '',
      audience TEXT DEFAULT '',
      custom_voice TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_dark BOOLEAN DEFAULT FALSE,
      font_size INTEGER DEFAULT 18,
      default_mode TEXT DEFAULT 'CLARITY',
      default_intent TEXT DEFAULT 'Persuade',
      default_audience TEXT DEFAULT 'LinkedIn Connections',
      default_platform TEXT DEFAULT 'LinkedIn Post'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS usage_stats (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      mode TEXT,
      platform TEXT,
      input_length INTEGER,
      output_length INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_history_created ON history(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usage_user ON usage_stats(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;

  console.log("[WriteWell] Database schema initialized");
}
