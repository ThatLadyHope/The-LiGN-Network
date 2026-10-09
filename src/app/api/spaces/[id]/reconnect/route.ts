import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { findMutualPairs, reportAllowedAfterClosure } from "@/lib/spaces";

// POST /api/spaces/[id]/reconnect { userId } — privately wish to talk again.
// A connection request is created ONLY when both wished (mutual).
// Unilateral wishes stay silent. Works during and after the space.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const wantedId = body?.userId;
  if (typeof wantedId !== "string" || wantedId === session.user.id) {
    return NextResponse.json({ error: "invalid-user" }, { status: 400 });
  }
  const space = await db.temporarySpace.findUnique({
    where: { id: params.id },
    include: { participants: true },
  });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const ids = space.participants.map((p) => p.userId);
  if (!ids.includes(session.user.id) || !ids.includes(wantedId)) {
    return NextResponse.json({ error: "not-participants" }, { status: 403 });
  }
  await db.spaceReconnectWish.upsert({
    where: {
      spaceId_wanterId_wantedId: { spaceId: params.id, wanterId: session.user.id, wantedId },
    },
    create: { spaceId: params.id, wanterId: session.user.id, wantedId },
    update: {},
  });
  const wishes = await db.spaceReconnectWish.findMany({ where: { spaceId: params.id } });
  const mutual = findMutualPairs(wishes).some(
    ([a, b]) =>
      (a === session.user.id && b === wantedId) || (a === wantedId && b === session.user.id),
  );
  let connected = false;
  if (mutual) {
    const dupe = await db.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, recipientId: wantedId },
          { senderId: wantedId, recipientId: session.user.id },
        ],
        state: "pending",
      },
    });
    if (!dupe) {
      await db.connectionRequest.create({
        data: {
          senderId: session.user.id,
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

// Reports stay possible inside the evidence window after closure.
export function closesAtPlusWindowOk(closedAt: Date, now: Date): boolean {
  return reportAllowedAfterClosure(closedAt, now);
}
