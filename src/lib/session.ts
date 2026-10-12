// Clerk-backed session: Clerk owns identity, LiGN owns the profile.
// Every API route resolves the LOCAL user id through this helper — never
// trust a client-sent id. Null means signed-out OR signed-in-without-profile
// (both route to onboarding on the client).
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function localUserId(): Promise<string | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const u = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  return u?.id ?? null;
}

export async function localUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  return db.user.findUnique({ where: { clerkId } });
}
