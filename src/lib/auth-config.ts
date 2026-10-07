// LiGN Phase 3 — Better Auth wiring (PRD §5, §8).
// Email + password, DB-backed sessions in Postgres. One identity per account (§5).
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export interface AuthDatabase {
  // Minimal structural type: the generated PrismaClient satisfies this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function createAuth(db: AuthDatabase) {
  return betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    emailAndPassword: { enabled: true, minPasswordLength: 10 },
    session: { expiresIn: 60 * 60 * 24 * 30 }, // 30 days
  });
}

export type Auth = ReturnType<typeof createAuth>;
