import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

// Lazy dummy hash -- computed on first use, not at module load (avoids blocking cold start)
let _dummyHash: string | null = null;
function getDummyHash(): string {
  if (!_dummyHash) {
    _dummyHash = bcrypt.hashSync("writewell-timing-safe-dummy-pw", BCRYPT_ROUNDS);
  }
  return _dummyHash;
}

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
  await bcrypt.compare(password, getDummyHash());
}
