import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// PUT /api/memories/[id] { op: "approve" | "withdraw" } — accept a shared
// memory, or leave it (vanishes from my view; the other is never told why).

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const memory = await db.sharedMemory.findUnique({ where: { id: params.id } });
  if (
    !memory ||
    (memory.participantA !== session.user.id && memory.participantB !== session.user.id)
  ) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  if (body?.op === "approve") {
    const data =
      memory.participantA === session.user.id ? { approvedA: true } : { approvedB: true };
    await db.sharedMemory.update({ where: { id: memory.id }, data });
    return NextResponse.json({ ok: true, approved: true });
  }
  if (body?.op === "withdraw") {
    if (!memory.withdrawnBy.includes(session.user.id)) {
      await db.sharedMemory.update({
        where: { id: memory.id },
        data: { withdrawnBy: [...memory.withdrawnBy, session.user.id] },
      });
    }
    return NextResponse.json({ ok: true, withdrawn: true });
  }
  return NextResponse.json({ error: "invalid-op" }, { status: 400 });
}
