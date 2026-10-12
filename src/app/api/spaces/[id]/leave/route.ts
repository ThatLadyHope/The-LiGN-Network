import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";

// POST /api/spaces/[id]/leave — free leave anytime. Creator-leave transfers
// ownership to the earliest-joined remaining participant; an empty space closes.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await db.temporarySpace.findUnique({
    where: { id: params.id },
    include: { participants: { orderBy: { joinedAt: "asc" } } },
  });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  await db.spaceParticipant.deleteMany({
    where: { spaceId: space.id, userId: userId },
  });
  const rest = space.participants.filter((p) => p.userId !== userId);
  if (userId === space.creatorId) {
    if (rest.length === 0) {
      await db.temporarySpace.update({ where: { id: space.id }, data: { state: "closed" } });
    } else {
      await db.temporarySpace.update({
        where: { id: space.id },
        data: { creatorId: rest[0].userId },
      });
    }
  }
  return NextResponse.json({ ok: true });
}
