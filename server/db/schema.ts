import { pgTable, serial, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_users_email").on(table.email),
]);

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  input: text("input").notNull(),
  inputFull: text("input_full").notNull(),
  output: text("output").notNull(),
  mode: text("mode").notNull(),
  platform: text("platform").default(""),
  intent: text("intent").default(""),
  audience: text("audience").default(""),
  customVoice: text("custom_voice").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_history_user").on(table.userId),
  index("idx_history_created").on(table.createdAt),
]);

export const settings = pgTable("settings", {
  userId: integer("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
  isDark: boolean("is_dark").default(false),
  fontSize: integer("font_size").default(18),
  defaultMode: text("default_mode").default("CLARITY"),
  defaultIntent: text("default_intent").default("Persuade"),
  defaultAudience: text("default_audience").default("LinkedIn Connections"),
  defaultPlatform: text("default_platform").default("LinkedIn Post"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_sessions_user").on(table.userId),
  index("idx_sessions_expires").on(table.expiresAt),
]);

export const usageStats = pgTable("usage_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  mode: text("mode"),
  platform: text("platform"),
  inputLength: integer("input_length"),
  outputLength: integer("output_length"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_usage_user").on(table.userId),
]);
