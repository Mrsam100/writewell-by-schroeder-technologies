import { hash, verify } from "@node-rs/argon2";
import bcrypt from "bcryptjs";
import { updatePasswordHash } from "../db/repositories/users";

// Argon2id config (OWASP recommended)
const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

// Pre-compute a real argon2 hash at startup for timing-safe dummy verification.
// This ensures dummyVerify takes the same time as a real verify.
let _dummyHash: string | null = null;
const _dummyHashReady = hash("writewell-timing-safe-dummy-pw", ARGON2_OPTIONS)
  .then((h) => { _dummyHash = h; })
  .catch(() => { /* startup only */ });

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

/**
 * Verify password against hash. Supports both argon2 and legacy bcrypt hashes.
 * If a bcrypt hash is verified successfully, it gets rehashed to argon2 transparently.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  userId?: number
): Promise<boolean> {
  // Argon2 hashes start with $argon2
  if (storedHash.startsWith("$argon2")) {
    try {
      return await verify(storedHash, password);
    } catch {
      // Malformed hash — treat as invalid
      return false;
    }
  }

  // Legacy bcrypt hashes start with $2a$ or $2b$
  if (storedHash.startsWith("$2")) {
    const valid = await bcrypt.compare(password, storedHash);
    if (valid && userId) {
      // Rehash to argon2 transparently (fire-and-forget)
      hashPassword(password)
        .then((newHash) => updatePasswordHash(userId, newHash))
        .catch((err) => console.error("[Auth] Failed to rehash password:", err.message));
    }
    return valid;
  }

  return false;
}

/** Constant-time dummy verify to prevent timing attacks on non-existent users */
export async function dummyVerify(password: string): Promise<void> {
  // Wait for startup hash if still pending
  if (!_dummyHash) await _dummyHashReady;
  if (_dummyHash) {
    try {
      await verify(_dummyHash, password);
    } catch {
      // Expected to fail — just consuming time
    }
  }
}
