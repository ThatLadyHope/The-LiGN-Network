import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";

// PUT /api/memories/[id] { op: "approve" | "withdraw" } — accept a shared
// memory, or leave it (vanishes from my view; the other is never told why).

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const memory = await db.sharedMemory.findUnique({ where: { id: params.id } });
  if (
    !memory ||
    (memory.participantA !== userId && memory.participantB !== userId)
  ) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  if (body?.op === "approve") {
    const data =
      memory.participantA === userId ? { approvedA: true } : { approvedB: true };
    await db.sharedMemory.update({ where: { id: memory.id }, data });
    return NextResponse.json({ ok: true, approved: true });
  }
  if (body?.op === "withdraw") {
    if (!memory.withdrawnBy.includes(userId)) {
      await db.sharedMemory.update({
        where: { id: memory.id },
        data: { withdrawnBy: [...memory.withdrawnBy, userId] },
      });
    }
    return NextResponse.json({ ok: true, withdrawn: true });
  }
  return NextResponse.json({ error: "invalid-op" }, { status: 400 });
}
