import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// GET /api/spaces/[id] — space detail for members. Auto-expires on read:
// past closesAt flips open → expired, and participation stops there.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await db.temporarySpace.findUnique({
    where: { id: params.id },
    include: { participants: true },
  });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const member = space.participants.some((p) => p.userId === session.user.id);
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
    mine: session.user.id,
    isCreator: space.creatorId === session.user.id,
  });
}
