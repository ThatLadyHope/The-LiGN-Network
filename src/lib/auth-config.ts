// LiGN Phase 3 — Better Auth wiring (PRD §5, §8) + agreement enforcement.
// Email + password, DB-backed sessions in Postgres. One identity per account (§5).
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { AGREEMENT_TEXT, AGREEMENT_VERSION, acceptanceValid } from "./agreement";
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
    // `agreementVersion` travels with signup so the create-hook can enforce
    // the agreement; the immutable record lives in AgreementAcceptance.
    user: {
      fields: { name: "nickname" },
      additionalFields: {
        agreementVersion: { type: "string", required: false },
      },
    },
    databaseHooks: {
      user: {
        create: {
          // Backend gate: no valid acceptance claim, no account. Throwing
          // here aborts creation — nothing is stored.
          async before(user) {
            const claimed = (user as Record<string, unknown>).agreementVersion;
            if (!acceptanceValid(claimed)) {
              throw new APIError("BAD_REQUEST", { message: "agreement-required" });
            }
            return { data: { ...user, agreementVersion: AGREEMENT_VERSION } };
          },
          // Record the acceptance with a server timestamp + exact text.
          // Fail-safe: if the record cannot be stored, remove the just
          // created user and fail instead of an account without a record.
          async after(user) {
            const record = {
              userId: user.id as string,
              version: AGREEMENT_VERSION,
              textSnapshot: AGREEMENT_TEXT,
              status: "accepted",
            };
            try {
              await db.agreementAcceptance.create({ data: record });
            } catch (err) {
              await db.user.delete({ where: { id: user.id as string } }).catch(() => null);
              throw err instanceof Error ? err : new Error("acceptance-record-failed");
            }
          },
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      // Inbox proof at signup doubles as the welcome: one mail, verify link
      // plus first steps. Non-blocking — the app never holds signup hostage.
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Reset your LiGN password",
          html: `<p>You asked to reset your LiGN password. This link works once:</p><p><a href="${url}">Reset password</a></p><p>If that was not you, ignore this mail — nothing changes.</p>`,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Welcome to LiGN — verify your email",
          html: `<p>Welcome to LiGN, ${user.name ?? "friend"}. One click proves this inbox is yours:</p><p><a href="${url}">Verify my email</a></p><p>Then: say what kind of connection you need, and meet someone real. No streaks, no pressure — silence is normal here.</p>`,
        });
      },
    },
    session: { expiresIn: 60 * 60 * 24 * 30 }, // 30 days
  });
}

export type Auth = ReturnType<typeof createAuth>;

// Admin retrieval seam: acceptance records + exact text, by user.
export async function getAcceptanceRecords(db: AuthDatabase, userId: string) {
  return db.agreementAcceptance.findMany({
    where: { userId },
    orderBy: { acceptedAt: "asc" },
  });
}
