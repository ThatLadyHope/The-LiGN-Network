// LiGN Phase 3 — Better Auth wiring (PRD §5, §8).
// Email + password, DB-backed sessions in Postgres. One identity per account (§5).
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendMail } from "./email";

export interface AuthDatabase {
  // Minimal structural type: the generated PrismaClient satisfies this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function createAuth(db: AuthDatabase) {
  return betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    // LiGN identity is the nickname: better-auth's `name` writes straight
    // into our `nickname` column, so one signup creates one identity.
    user: { fields: { name: "nickname" } },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      // Forgot-password delivery doubles as email verification at that point:
      // the link proves inbox control before any password changes.
      sendResetPassword: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Reset your LiGN password",
          html: `<p>You asked to reset your LiGN password. This link works once:</p><p><a href="${url}">Reset password</a></p><p>If that was not you, ignore this mail — nothing changes.</p>`,
        });
      },
    },
    session: { expiresIn: 60 * 60 * 24 * 30 }, // 30 days
  });
}

export type Auth = ReturnType<typeof createAuth>;
