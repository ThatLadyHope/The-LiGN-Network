import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { findMutualPairs, reportAllowedAfterClosure } from "@/lib/spaces";

// POST /api/spaces/[id]/reconnect { userId } — privately wish to talk again.
// A connection request is created ONLY when both wished (mutual).
// Unilateral wishes stay silent. Works during and after the space.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const wantedId = body?.userId;
  if (typeof wantedId !== "string" || wantedId === userId) {
    return NextResponse.json({ error: "invalid-user" }, { status: 400 });
  }
  const space = await db.temporarySpace.findUnique({
    where: { id: params.id },
    include: { participants: true },
  });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const ids = space.participants.map((p) => p.userId);
  if (!ids.includes(userId) || !ids.includes(wantedId)) {
    return NextResponse.json({ error: "not-participants" }, { status: 403 });
  }
  await db.spaceReconnectWish.upsert({
    where: {
      spaceId_wanterId_wantedId: { spaceId: params.id, wanterId: userId, wantedId },
    },
    create: { spaceId: params.id, wanterId: userId, wantedId },
    update: {},
  });
  const wishes = await db.spaceReconnectWish.findMany({ where: { spaceId: params.id } });
  const mutual = findMutualPairs(wishes).some(
    ([a, b]) =>
      (a === userId && b === wantedId) || (a === wantedId && b === userId),
  );
  let connected = false;
  if (mutual) {
    const dupe = await db.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, recipientId: wantedId },
          { senderId: wantedId, recipientId: userId },
        ],
        state: "pending",
      },
    });
    if (!dupe) {
      await db.connectionRequest.create({
        data: {
          senderId: userId,
          recipientId: wantedId,
          note: "From a temporary space together.",
          state: "pending",
        },
      });
    }
    connected = true;
  }
  return NextResponse.json({ ok: true, connected });
}
