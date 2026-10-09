import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// POST /api/spaces/[id]/leave — free leave anytime. Creator-leave transfers
// ownership to the earliest-joined remaining participant; an empty space closes.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await db.temporarySpace.findUnique({
    where: { id: params.id },
    include: { participants: { orderBy: { joinedAt: "asc" } } },
  });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  await db.spaceParticipant.deleteMany({
    where: { spaceId: space.id, userId: session.user.id },
  });
  const rest = space.participants.filter((p) => p.userId !== session.user.id);
  if (session.user.id === space.creatorId) {
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
