import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { reportAllowedAfterClosure } from "@/lib/spaces";

// GET /api/spaces/[id] — space detail for members. Auto-expires on read:
// past closesAt flips open → expired, and participation stops there.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await db.temporarySpace.findUnique({
    where: { id: params.id },
    include: { participants: true },
  });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const member = space.participants.some((p) => p.userId === userId);
  if (!member) return NextResponse.json({ error: "not-member" }, { status: 403 });

  let state = space.state;
  if (state === "open" && new Date() >= space.closesAt) {
    await db.temporarySpace.update({ where: { id: space.id }, data: { state: "expired" } });
    state = "expired";
  }
  const users = await db.user.findMany({
    where: { id: { in: space.participants.map((p) => p.userId) } },
    select: { id: true, nickname: true },
  });
  return NextResponse.json({
    space: { ...space, state },
    members: users,
    mine: userId,
    isCreator: space.creatorId === userId,
  });
}

// DELETE /api/spaces/[id] — creator deletes history ONLY after the 30-day
// report window closes. Protects others' reconnect rights and evidence.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await db.temporarySpace.findUnique({ where: { id: params.id } });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (space.creatorId !== userId) {
    return NextResponse.json({ error: "creator-only" }, { status: 403 });
  }
  if (space.state === "open" || !reportAllowedAfterClosure(space.closesAt, new Date())) {
    return NextResponse.json({ error: "report-window-open" }, { status: 409 });
  }
  await db.spaceReconnectWish.deleteMany({ where: { spaceId: space.id } });
  await db.message.deleteMany({ where: { spaceId: space.id } });
  await db.spaceParticipant.deleteMany({ where: { spaceId: space.id } });
  await db.temporarySpace.delete({ where: { id: space.id } });
  return NextResponse.json({ ok: true });
}
