import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

// Pre-compute a dummy hash at startup for timing-safe dummy verification.
const _dummyHash = bcrypt.hashSync("writewell-timing-safe-dummy-pw", BCRYPT_ROUNDS);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  if (!storedHash.startsWith("$2")) return false;
  return bcrypt.compare(password, storedHash);
}

/** Constant-time dummy verify to prevent timing attacks on non-existent users */
export async function dummyVerify(password: string): Promise<void> {
  await bcrypt.compare(password, _dummyHash);
}
