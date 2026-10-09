import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// POST /api/spaces/[id]/close — creator ends the space early.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await db.temporarySpace.findUnique({ where: { id: params.id } });
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (space.creatorId !== session.user.id) {
    return NextResponse.json({ error: "creator-only" }, { status: 403 });
  }
  if (space.state !== "open") return NextResponse.json({ error: "already-closed" }, { status: 409 });
  await db.temporarySpace.update({ where: { id: space.id }, data: { state: "closed" } });
  return NextResponse.json({ ok: true });
}
