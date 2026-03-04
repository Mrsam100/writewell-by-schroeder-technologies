import { neon } from "@neondatabase/serverless";
import { config } from "../config";

let done = false;

/**
 * Idempotent schema bootstrap — runs CREATE TABLE IF NOT EXISTS for every table.
 * Drizzle ORM is used at runtime but doesn't auto-create tables; this fills that gap.
 */
export async function ensureSchema(): Promise<void> {
  if (done) return;

  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const sql = neon(config.databaseUrl);

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
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
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

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_history_created ON history(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usage_user ON usage_stats(user_id)`;

  done = true;
  console.log("[WriteWell] Database schema initialized");
}
