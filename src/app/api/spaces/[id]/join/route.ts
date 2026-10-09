import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// POST /api/spaces/[id]/join — join an open, unexpired space under capacity.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await db.temporarySpace.findUnique({
    where: { id: params.id },
    include: { participants: true },
  });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (space.state !== "open" || new Date() >= space.closesAt) {
    return NextResponse.json({ error: "closed" }, { status: 409 });
  }
  if (space.participants.some((p) => p.userId === session.user.id)) {
    return NextResponse.json({ ok: true, joined: false });
  }
  if (space.participants.length >= space.capacity) {
    return NextResponse.json({ error: "at-capacity" }, { status: 409 });
  }
  await db.spaceParticipant.create({ data: { spaceId: space.id, userId: session.user.id } });
  return NextResponse.json({ ok: true, joined: true });
}
