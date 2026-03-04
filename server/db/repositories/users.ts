import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { users } from "../schema";

export async function findByEmail(email: string) {
  const db = getDb();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      passwordHash: users.passwordHash,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return rows[0] || null;
}

export async function createUser(email: string, passwordHash: string, name: string | null) {
  const db = getDb();
  const rows = await db
    .insert(users)
    .values({ email, passwordHash, name })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id, email: users.email, name: users.name });
  return rows[0] || null;
}

export async function findById(id: number) {
  const db = getDb();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return rows[0] || null;
}

export async function updatePasswordHash(id: number, newHash: string) {
  const db = getDb();
  await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, id));
}
