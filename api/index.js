"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/vercel-entry.ts
var vercel_entry_exports = {};
__export(vercel_entry_exports, {
  default: () => vercel_entry_default
});
module.exports = __toCommonJS(vercel_entry_exports);
var import_vercel = require("hono/vercel");

// server/app.ts
var import_hono5 = require("hono");
var import_cors = require("hono/cors");
var import_logger = require("hono/logger");
var import_secure_headers = require("hono/secure-headers");

// server/config.ts
var import_dotenv = __toESM(require("dotenv"));
if (!process.env.VERCEL) import_dotenv.default.config();
var config = {
  port: parseInt(process.env.PORT || "3001", 10),
  openrouterApiKey: process.env.OPENROUTER_API_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
  corsOrigins: (process.env.CORS_ORIGINS || "*").split(","),
  sessionSecret: process.env.SESSION_SECRET || "writewell-dev-session-secret",
  rateLimit: {
    windowMs: 6e4,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "20", 10)
  },
  isProduction: process.env.NODE_ENV === "production"
};

// server/routes/auth.ts
var import_hono = require("hono");

// server/db/repositories/users.ts
var import_drizzle_orm = require("drizzle-orm");

// server/db/index.ts
var import_serverless = require("@neondatabase/serverless");
var import_neon_http = require("drizzle-orm/neon-http");

// server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  history: () => history,
  sessions: () => sessions,
  settings: () => settings,
  usageStats: () => usageStats,
  users: () => users
});
var import_pg_core = require("drizzle-orm/pg-core");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  email: (0, import_pg_core.text)("email").unique().notNull(),
  passwordHash: (0, import_pg_core.text)("password_hash").notNull(),
  name: (0, import_pg_core.text)("name"),
  isVerified: (0, import_pg_core.boolean)("is_verified").default(false),
  createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).defaultNow()
}, (table) => [
  (0, import_pg_core.index)("idx_users_email").on(table.email)
]);
var history = (0, import_pg_core.pgTable)("history", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.integer)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  input: (0, import_pg_core.text)("input").notNull(),
  inputFull: (0, import_pg_core.text)("input_full").notNull(),
  output: (0, import_pg_core.text)("output").notNull(),
  mode: (0, import_pg_core.text)("mode").notNull(),
  platform: (0, import_pg_core.text)("platform").default(""),
  intent: (0, import_pg_core.text)("intent").default(""),
  audience: (0, import_pg_core.text)("audience").default(""),
  customVoice: (0, import_pg_core.text)("custom_voice").default(""),
  createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).defaultNow()
}, (table) => [
  (0, import_pg_core.index)("idx_history_user").on(table.userId),
  (0, import_pg_core.index)("idx_history_created").on(table.createdAt)
]);
var settings = (0, import_pg_core.pgTable)("settings", {
  userId: (0, import_pg_core.integer)("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
  isDark: (0, import_pg_core.boolean)("is_dark").default(false),
  fontSize: (0, import_pg_core.integer)("font_size").default(18),
  defaultMode: (0, import_pg_core.text)("default_mode").default("CLARITY"),
  defaultIntent: (0, import_pg_core.text)("default_intent").default("Persuade"),
  defaultAudience: (0, import_pg_core.text)("default_audience").default("LinkedIn Connections"),
  defaultPlatform: (0, import_pg_core.text)("default_platform").default("LinkedIn Post")
});
var sessions = (0, import_pg_core.pgTable)("sessions", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  userId: (0, import_pg_core.integer)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: (0, import_pg_core.timestamp)("expires_at", { withTimezone: true }).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).defaultNow()
}, (table) => [
  (0, import_pg_core.index)("idx_sessions_user").on(table.userId),
  (0, import_pg_core.index)("idx_sessions_expires").on(table.expiresAt)
]);
var usageStats = (0, import_pg_core.pgTable)("usage_stats", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.integer)("user_id").references(() => users.id, { onDelete: "set null" }),
  action: (0, import_pg_core.text)("action").notNull(),
  mode: (0, import_pg_core.text)("mode"),
  platform: (0, import_pg_core.text)("platform"),
  inputLength: (0, import_pg_core.integer)("input_length"),
  outputLength: (0, import_pg_core.integer)("output_length"),
  createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).defaultNow()
}, (table) => [
  (0, import_pg_core.index)("idx_usage_user").on(table.userId)
]);

// server/db/index.ts
var dbInstance = null;
function getDb() {
  if (dbInstance) return dbInstance;
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not configured. Set it in your environment variables.");
  }
  const sql = (0, import_serverless.neon)(config.databaseUrl);
  dbInstance = (0, import_neon_http.drizzle)(sql, { schema: schema_exports });
  return dbInstance;
}

// server/db/repositories/users.ts
async function findByEmail(email) {
  const db = getDb();
  const rows = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    passwordHash: users.passwordHash,
    createdAt: users.createdAt
  }).from(users).where((0, import_drizzle_orm.eq)(users.email, email)).limit(1);
  return rows[0] || null;
}
async function createUser(email, passwordHash, name) {
  const db = getDb();
  const rows = await db.insert(users).values({ email, passwordHash, name }).onConflictDoNothing({ target: users.email }).returning({ id: users.id, email: users.email, name: users.name });
  return rows[0] || null;
}
async function findById(id) {
  const db = getDb();
  const rows = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    createdAt: users.createdAt
  }).from(users).where((0, import_drizzle_orm.eq)(users.id, id)).limit(1);
  return rows[0] || null;
}

// server/auth/password.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var BCRYPT_ROUNDS = 10;
var _dummyHash = null;
function getDummyHash() {
  if (!_dummyHash) {
    _dummyHash = import_bcryptjs.default.hashSync("writewell-timing-safe-dummy-pw", BCRYPT_ROUNDS);
  }
  return _dummyHash;
}
async function hashPassword(password) {
  return import_bcryptjs.default.hash(password, BCRYPT_ROUNDS);
}
async function verifyPassword(password, storedHash) {
  if (!storedHash.startsWith("$2")) return false;
  return import_bcryptjs.default.compare(password, storedHash);
}
async function dummyVerify(password) {
  await import_bcryptjs.default.compare(password, getDummyHash());
}

// server/auth/session.ts
var import_crypto = __toESM(require("crypto"));
var import_drizzle_orm2 = require("drizzle-orm");
var import_cookie = require("hono/cookie");
var SESSION_COOKIE = "writewell_session";
var SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
var MAX_SESSIONS_PER_USER = 5;
var SESSION_ID_REGEX = /^[0-9a-f]{64}$/;
function generateSessionId() {
  return import_crypto.default.randomBytes(32).toString("hex");
}
function isValidSessionId(id) {
  return SESSION_ID_REGEX.test(id);
}
async function createSession(userId) {
  const db = getDb();
  const id = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const existing = await db.select({ id: sessions.id }).from(sessions).where((0, import_drizzle_orm2.eq)(sessions.userId, userId)).orderBy(sessions.createdAt);
  if (existing.length >= MAX_SESSIONS_PER_USER) {
    const toDelete = existing.slice(0, existing.length - MAX_SESSIONS_PER_USER + 1);
    for (const s of toDelete) {
      await db.delete(sessions).where((0, import_drizzle_orm2.eq)(sessions.id, s.id));
    }
  }
  await db.insert(sessions).values({ id, userId, expiresAt });
  return id;
}
async function validateSession(sessionId) {
  if (!isValidSessionId(sessionId)) return null;
  const db = getDb();
  const rows = await db.select({ userId: sessions.userId }).from(sessions).where((0, import_drizzle_orm2.and)((0, import_drizzle_orm2.eq)(sessions.id, sessionId), (0, import_drizzle_orm2.gt)(sessions.expiresAt, /* @__PURE__ */ new Date()))).limit(1);
  return rows[0] || null;
}
async function deleteSession(sessionId) {
  if (!isValidSessionId(sessionId)) return;
  const db = getDb();
  await db.delete(sessions).where((0, import_drizzle_orm2.eq)(sessions.id, sessionId));
}
async function cleanupExpiredSessions() {
  const db = getDb();
  await db.delete(sessions).where((0, import_drizzle_orm2.lt)(sessions.expiresAt, /* @__PURE__ */ new Date()));
}
function setSessionCookie(c, sessionId) {
  (0, import_cookie.setCookie)(c, SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1e3
    // seconds
  });
}
function getSessionCookie(c) {
  return (0, import_cookie.getCookie)(c, SESSION_COOKIE);
}
function clearSessionCookie(c) {
  (0, import_cookie.deleteCookie)(c, SESSION_COOKIE, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "Lax",
    path: "/"
  });
}

// server/auth/csrf.ts
var import_crypto2 = __toESM(require("crypto"));
var import_factory = require("hono/factory");
var import_cookie2 = require("hono/cookie");
var CSRF_COOKIE = "writewell_csrf";
var CSRF_HEADER = "x-csrf-token";
function rotateCsrfCookie(c) {
  const token = import_crypto2.default.randomBytes(32).toString("hex");
  (0, import_cookie2.setCookie)(c, CSRF_COOKIE, token, {
    httpOnly: false,
    // Must be readable by JS
    secure: config.isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60
    // 7 days in seconds
  });
}
function ensureCsrfCookie(c) {
  if (!(0, import_cookie2.getCookie)(c, CSRF_COOKIE)) {
    rotateCsrfCookie(c);
  }
}
function timingSafeCompare(a, b) {
  if (a.length !== b.length) return false;
  return import_crypto2.default.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}
var csrfProtection = (0, import_factory.createMiddleware)(async (c, next) => {
  const method = c.req.method.toUpperCase();
  ensureCsrfCookie(c);
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const cookieToken = (0, import_cookie2.getCookie)(c, CSRF_COOKIE);
    const headerToken = c.req.header(CSRF_HEADER);
    if (!cookieToken || !headerToken || !timingSafeCompare(cookieToken, headerToken)) {
      return c.json({ error: "CSRF validation failed." }, 403);
    }
  }
  await next();
});

// server/middleware/auth.ts
var import_factory2 = require("hono/factory");
var requireAuth = (0, import_factory2.createMiddleware)(async (c, next) => {
  const sessionId = getSessionCookie(c);
  if (!sessionId) {
    ensureCsrfCookie(c);
    return c.json({ error: "Authentication required." }, 401);
  }
  const session = await validateSession(sessionId);
  if (!session) {
    clearSessionCookie(c);
    ensureCsrfCookie(c);
    return c.json({ error: "Session expired. Please log in again." }, 401);
  }
  const user = await findById(session.userId);
  if (!user) {
    clearSessionCookie(c);
    return c.json({ error: "User not found." }, 401);
  }
  c.set("user", { userId: user.id, email: user.email });
  if (Math.random() < 0.01) {
    cleanupExpiredSessions().catch(
      (err) => console.error("[Auth] Session cleanup failed:", err.message)
    );
  }
  await next();
});
var optionalAuth = (0, import_factory2.createMiddleware)(async (c, next) => {
  const sessionId = getSessionCookie(c);
  if (sessionId) {
    try {
      const session = await validateSession(sessionId);
      if (session) {
        const user = await findById(session.userId);
        if (user) {
          c.set("user", { userId: user.id, email: user.email });
        }
      } else {
        clearSessionCookie(c);
      }
    } catch {
    }
  }
  await next();
});

// server/middleware/rateLimit.ts
var import_factory3 = require("hono/factory");
function createLimiter(windowMs, maxRequests) {
  const hits = /* @__PURE__ */ new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }
  }, 5 * 6e4);
  if (typeof timer === "object" && "unref" in timer) timer.unref();
  return (0, import_factory3.createMiddleware)(async (c, next) => {
    const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || c.req.header("x-real-ip") || "unknown";
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }
    entry.count++;
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1e3);
      c.header("Retry-After", String(retryAfter));
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }
    await next();
  });
}
var rateLimit = createLimiter(config.rateLimit.windowMs, config.rateLimit.maxRequests);
var authRateLimit = createLimiter(15 * 6e4, 10);

// server/routes/auth.ts
var auth = new import_hono.Hono();
var MAX_PASSWORD_LENGTH = 72;
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function normalizeEmail(raw) {
  return raw.trim().toLowerCase();
}
auth.post("/register", authRateLimit, async (c) => {
  const body = await c.req.json();
  const { password, name } = body;
  const rawEmail = body.email;
  if (!rawEmail || !password || typeof rawEmail !== "string" || typeof password !== "string") {
    return c.json({ error: "Email and password are required." }, 400);
  }
  const email = normalizeEmail(rawEmail);
  if (!EMAIL_REGEX.test(email)) {
    return c.json({ error: "Please provide a valid email address." }, 400);
  }
  if (password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters." }, 400);
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return c.json({ error: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.` }, 400);
  }
  if (name && (typeof name !== "string" || name.trim().length > 100)) {
    return c.json({ error: "Name must be 100 characters or fewer." }, 400);
  }
  const passwordHash = await hashPassword(password);
  const trimmedName = name ? name.trim() : null;
  const user = await createUser(email, passwordHash, trimmedName);
  if (!user) {
    return c.json({ error: "An account with this email already exists." }, 409);
  }
  const sessionId = await createSession(user.id);
  setSessionCookie(c, sessionId);
  rotateCsrfCookie(c);
  return c.json({ user }, 201);
});
auth.post("/login", authRateLimit, async (c) => {
  const body = await c.req.json();
  const { password } = body;
  const rawEmail = body.email;
  if (!rawEmail || !password || typeof rawEmail !== "string" || typeof password !== "string") {
    return c.json({ error: "Email and password are required." }, 400);
  }
  const email = normalizeEmail(rawEmail);
  const user = await findByEmail(email);
  if (!user) {
    await dummyVerify(password);
    return c.json({ error: "Invalid email or password." }, 401);
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return c.json({ error: "Invalid email or password." }, 401);
  }
  const sessionId = await createSession(user.id);
  setSessionCookie(c, sessionId);
  rotateCsrfCookie(c);
  return c.json({ user: { id: user.id, email: user.email, name: user.name } });
});
auth.post("/logout", async (c) => {
  const sessionId = getSessionCookie(c);
  if (sessionId) {
    await deleteSession(sessionId).catch(() => {
    });
  }
  clearSessionCookie(c);
  return c.json({ ok: true });
});
auth.get("/me", requireAuth, async (c) => {
  const authUser = c.get("user");
  const user = await findById(authUser.userId);
  if (!user) return c.json({ error: "User not found." }, 404);
  ensureCsrfCookie(c);
  return c.json({ user });
});
var auth_default = auth;

// server/routes/api.ts
var import_hono2 = require("hono");

// server/services/openrouter.ts
var import_openai = __toESM(require("openai"));

// server/prompts/index.ts
var makeSystemPrompt = (mode, intent, audience, platform, customVoice) => `
You are WriteWell by Schroeder Technologies, the world's most advanced writing intelligence engine. You are NOT a grammar checker. You are NOT a synonym swapper. You transform writing so it actually achieves its purpose.

CONTEXT:
- Rewrite Mode: ${mode}
- Writing Intent: ${intent}
- Target Audience: ${audience}
- Platform: ${platform}
${customVoice ? `- Custom Brand Voice: ${customVoice}` : ""}

YOUR JOB:
Rewrite the user's text so it achieves the stated intent for the stated audience on the stated platform. Apply the rewrite mode as your primary transformation lens.
${customVoice ? `ADHERE STRICTLY to the Custom Brand Voice provided.` : ""}

REWRITE MODES:
- CLARITY: Cut every word that doesn't earn its place. Short sentences. Active voice. One idea per sentence. Reader should never have to re-read.
- AUTHORITY: Make the writer sound like the definitive expert. Specific, concrete, confident. No hedging. No qualifiers. Claims backed by mechanism.
- PERSUASION: Build desire. Address the reader's self-interest. Use the problem-agitate-solve structure. Make the reader feel something before you ask anything.
- WARMTH: Human, conversational, genuine. Remove all corporate language. Sound like a thoughtful person talking to another person they respect.
- CONCISION: Reduce by 40-50%. Every sentence must justify its existence. Cut preamble, filler, redundancy. Keep all meaning.
- EXECUTIVE: Write for someone who reads at 3x speed. Lead with the conclusion. Use strong topic sentences. Bullet only when truly list-like.

RULES:
- NEVER change the writer's core message or facts
- NEVER add information that wasn't in the original
- PRESERVE the writer's argument \u2014 improve HOW it's expressed
- Do NOT use: "transformative", "leverage", "synergy", "elevate", "unlock", "journey", "empower", "innovative", "cutting-edge", "game-changing", "revolutionize"
- Match the platform: LinkedIn \u2260 Email \u2260 Essay \u2260 Proposal \u2260 Social post
- Output ONLY the rewritten text. No preamble. No explanation. No quotation marks around output.
`.trim();
var analysisPrompt = (text2) => `
Analyse this writing and return a JSON object. No preamble. No markdown. Raw JSON only.

TEXT:
"${text2}"

Return exactly this structure:
{
  "readability": <0-100 score>,
  "clarity": <0-100 score>,
  "authority": <0-100 score>,
  "engagement": <0-100 score>,
  "detected_intent": "<one of: Persuade / Inform / Instruct / Sell / Network / Report>",
  "detected_tone": "<one of: Formal / Conversational / Technical / Emotional / Neutral>",
  "word_count": <number>,
  "sentence_count": <number>,
  "avg_sentence_length": <number>,
  "passive_voice_count": <number>,
  "issues": [
    { "type": "<Grammar|Clarity|Tone|Structure|Wordiness>", "text": "<the problematic phrase, max 6 words>", "suggestion": "<specific fix in under 12 words>" }
  ],
  "banned_words": ["<any found from this list: amazing, leverage, synergy, elevate, unlock, journey, empower, innovative, utilize, cutting-edge, game-changing, revolutionize, transformative, impactful, holistic, robust, scalable, seamlessly, ecosystem, paradigm>"],
  "summary": "<one sentence: what is strong about this writing>",
  "weakness": "<one sentence: the single biggest thing holding this writing back>"
}
`.trim();

// server/services/openrouter.ts
var client = new import_openai.default({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openrouterApiKey
});
var PRIMARY_MODEL = "google/gemini-2.0-flash-001";
var FALLBACK_MODEL = "google/gemini-flash-1.5";
async function chatCompletion(messages, options) {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError = null;
  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const completion = await client.chat.completions.create({
          model,
          messages,
          temperature: 0.7,
          ...options?.json ? { response_format: { type: "json_object" } } : {}
        });
        return completion.choices[0]?.message?.content || "";
      } catch (err) {
        lastError = err;
        if (err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
          break;
        }
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
        }
      }
    }
  }
  throw new Error(`All models failed. Last error: ${lastError?.message || "Unknown"}`);
}
async function rewriteText(params) {
  const systemPrompt = makeSystemPrompt(
    params.mode,
    params.intent,
    params.audience,
    params.platform,
    params.customVoice
  );
  const result = await chatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: params.input }
  ]);
  return result || "Error generating rewrite.";
}
async function analyseText(input) {
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

// server/middleware/validate.ts
var import_zod = require("zod");
var stripControlChars = (s) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
var VALID_MODES = ["CLARITY", "AUTHORITY", "PERSUASION", "WARMTH", "CONCISION", "EXECUTIVE"];
var VALID_INTENTS = ["Persuade", "Inform", "Instruct", "Sell", "Network", "Report"];
var rewriteSchema = import_zod.z.object({
  input: import_zod.z.string().min(1, "Input text is required.").max(1e4, "Input exceeds maximum length of 10000 characters.").transform(stripControlChars),
  mode: import_zod.z.enum(VALID_MODES).optional().default("CLARITY"),
  intent: import_zod.z.enum(VALID_INTENTS).optional().default("Persuade"),
  audience: import_zod.z.string().max(200).optional().default("General Public").transform((s) => stripControlChars(s).slice(0, 200)),
  platform: import_zod.z.string().max(200).optional().default("General").transform((s) => stripControlChars(s).slice(0, 200)),
  customVoice: import_zod.z.string().max(500).optional().default("").transform((s) => stripControlChars(s).slice(0, 500))
});
var analyseSchema = import_zod.z.object({
  input: import_zod.z.string().min(1, "Input text is required.").max(1e4, "Input exceeds maximum length of 10000 characters.").transform(stripControlChars)
});

// server/db/repositories/history.ts
var import_drizzle_orm3 = require("drizzle-orm");
async function getHistory(userId, limit = 50) {
  const db = getDb();
  return db.select().from(history).where((0, import_drizzle_orm3.eq)(history.userId, userId)).orderBy((0, import_drizzle_orm3.desc)(history.createdAt)).limit(limit);
}
async function addHistory(params) {
  const db = getDb();
  const rows = await db.insert(history).values({
    userId: params.userId,
    input: params.input,
    inputFull: params.inputFull,
    output: params.output,
    mode: params.mode,
    platform: params.platform,
    intent: params.intent,
    audience: params.audience,
    customVoice: params.customVoice
  }).returning();
  return rows[0];
}
async function deleteHistoryItem(id, userId) {
  const db = getDb();
  const rows = await db.delete(history).where((0, import_drizzle_orm3.and)((0, import_drizzle_orm3.eq)(history.id, id), (0, import_drizzle_orm3.eq)(history.userId, userId))).returning({ id: history.id });
  return rows.length > 0;
}
async function clearHistory(userId) {
  const db = getDb();
  const rows = await db.delete(history).where((0, import_drizzle_orm3.eq)(history.userId, userId)).returning({ id: history.id });
  return rows.length;
}

// server/db/repositories/usage.ts
async function logUsage(params) {
  const db = getDb();
  await db.insert(usageStats).values({
    userId: params.userId,
    action: params.action,
    mode: params.mode || null,
    platform: params.platform || null,
    inputLength: params.inputLength || null,
    outputLength: params.outputLength || null
  });
}

// server/routes/api.ts
var api = new import_hono2.Hono();
api.post("/rewrite", optionalAuth, async (c) => {
  const body = await c.req.json();
  const parsed = rewriteSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }
  const { input, mode, intent, audience, platform, customVoice } = parsed.data;
  const result = await rewriteText({
    input,
    mode,
    intent,
    audience,
    platform,
    customVoice
  });
  const user = c.get("user");
  Promise.resolve().then(async () => {
    try {
      if (user) {
        await addHistory({
          userId: user.userId,
          input: input.substring(0, 200),
          inputFull: input,
          output: result,
          mode,
          platform,
          intent,
          audience,
          customVoice
        });
      }
      await logUsage({
        userId: user?.userId ?? null,
        action: "rewrite",
        mode,
        platform,
        inputLength: input.length,
        outputLength: result.length
      });
    } catch (dbErr) {
      console.error("[DB] Failed to log rewrite:", dbErr.message);
    }
  });
  return c.json({ result });
});
api.post("/analyse", optionalAuth, async (c) => {
  const body = await c.req.json();
  const parsed = analyseSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }
  const { input } = parsed.data;
  const result = await analyseText(input);
  const user = c.get("user");
  logUsage({
    userId: user?.userId ?? null,
    action: "analyse",
    inputLength: input.length
  }).catch((dbErr) => console.error("[DB] Failed to log analysis:", dbErr.message));
  return c.json({ result });
});
api.get("/health", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});
var api_default = api;

// server/routes/history.ts
var import_hono3 = require("hono");
var historyRoutes = new import_hono3.Hono();
historyRoutes.get("/", async (c) => {
  const user = c.get("user");
  const limitParam = c.req.query("limit");
  const limit = Math.min(Math.max(parseInt(limitParam || "50") || 50, 1), 200);
  const items = await getHistory(user.userId, limit);
  return c.json({ history: items });
});
historyRoutes.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
  const deleted = await deleteHistoryItem(id, user.userId);
  return c.json({ deleted });
});
historyRoutes.delete("/", async (c) => {
  const user = c.get("user");
  const count = await clearHistory(user.userId);
  return c.json({ cleared: count });
});
var history_default = historyRoutes;

// server/routes/settings.ts
var import_hono4 = require("hono");

// server/db/repositories/settings.ts
var import_drizzle_orm4 = require("drizzle-orm");
async function getSettings(userId) {
  const db = getDb();
  const rows = await db.select().from(settings).where((0, import_drizzle_orm4.eq)(settings.userId, userId)).limit(1);
  return rows[0] || null;
}
async function upsertSettings(userId, data) {
  const db = getDb();
  const isDark = typeof data.is_dark === "boolean" ? data.is_dark : false;
  const fontSize = Math.min(Math.max(typeof data.font_size === "number" ? data.font_size : 18, 10), 32);
  const defaultMode = typeof data.default_mode === "string" ? data.default_mode : "CLARITY";
  const defaultIntent = typeof data.default_intent === "string" ? data.default_intent : "Persuade";
  const defaultAudience = typeof data.default_audience === "string" ? data.default_audience : "LinkedIn Connections";
  const defaultPlatform = typeof data.default_platform === "string" ? data.default_platform : "LinkedIn Post";
  const values = {
    userId,
    isDark,
    fontSize,
    defaultMode,
    defaultIntent,
    defaultAudience,
    defaultPlatform
  };
  await db.insert(settings).values(values).onConflictDoUpdate({
    target: settings.userId,
    set: {
      isDark,
      fontSize,
      defaultMode,
      defaultIntent,
      defaultAudience,
      defaultPlatform
    }
  });
  return await getSettings(userId);
}

// server/routes/settings.ts
var settingsRoutes = new import_hono4.Hono();
var FIELD_MAP = {
  isDark: "is_dark",
  fontSize: "font_size",
  defaultMode: "default_mode",
  defaultIntent: "default_intent",
  defaultAudience: "default_audience",
  defaultPlatform: "default_platform"
};
settingsRoutes.get("/", async (c) => {
  const user = c.get("user");
  const result = await getSettings(user.userId);
  return c.json({ settings: result || {} });
});
settingsRoutes.put("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const clean = {};
  for (const [camel, snake] of Object.entries(FIELD_MAP)) {
    if (camel in body) clean[snake] = body[camel];
  }
  const updated = await upsertSettings(user.userId, clean);
  return c.json({ settings: updated });
});
var settings_default = settingsRoutes;

// server/app.ts
var app = new import_hono5.Hono();
app.use("*", (0, import_cors.cors)({
  origin: config.corsOrigins,
  credentials: true
}));
app.use("*", (0, import_logger.logger)());
app.use("*", (0, import_secure_headers.secureHeaders)());
app.use("/api/*", rateLimit);
app.route("/api/auth", auth_default);
app.use("/api/history/*", csrfProtection);
app.use("/api/history", csrfProtection);
app.use("/api/settings/*", csrfProtection);
app.use("/api/settings", csrfProtection);
app.use("/api/history/*", requireAuth);
app.route("/api/history", history_default);
app.use("/api/settings/*", requireAuth);
app.use("/api/settings", requireAuth);
app.route("/api/settings", settings_default);
app.route("/api", api_default);
app.onError((err, c) => {
  console.error("[Error]", err.message);
  if (err.message?.includes("API key")) {
    return c.json({ error: "Invalid API key configuration." }, 401);
  }
  if (err.message?.includes("safety")) {
    return c.json({ error: "Content was flagged by safety filters. Please try different text." }, 422);
  }
  if (err.message?.includes("quota")) {
    return c.json({ error: "API quota exceeded. Please try again later." }, 429);
  }
  if (err.message?.includes("Failed to parse analysis response")) {
    return c.json({ error: "Model returned invalid data. Please try again." }, 502);
  }
  if (err.message?.includes("Bad escaped character in JSON") || err.message?.includes("Unexpected token") || err.message?.includes("Unexpected end of JSON") || err.message?.includes("is not valid JSON")) {
    return c.json({ error: "Invalid request body." }, 400);
  }
  let message = "An internal error occurred.";
  if (!config.isProduction) {
    message = (err.message || "Unknown error").slice(0, 200);
    message = message.replace(/(?:postgres|mysql|https?):\/\/[^\s]+/gi, "[REDACTED_URL]");
  }
  return c.json({ error: message }, 500);
});
var app_default = app;

// server/db/migrate.ts
var import_serverless2 = require("@neondatabase/serverless");
var done = false;
async function ensureSchema() {
  if (done) return;
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }
  const sql = (0, import_serverless2.neon)(config.databaseUrl);
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
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_history_created ON history(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usage_user ON usage_stats(user_id)`;
  done = true;
  console.log("[WriteWell] Database schema initialized");
}

// server/vercel-entry.ts
ensureSchema().then(() => console.log("[Vercel] Schema ready")).catch((err) => console.error("[Vercel] DB init failed:", err.message));
var vercel_entry_default = (0, import_vercel.handle)(app_default);
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
