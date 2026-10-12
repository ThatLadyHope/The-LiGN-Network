import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";

// POST /api/listeners/join { need } — take a place in the listener queue.
// Idempotent per user; returns live position. Leave via DELETE.
export async function POST(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const need = typeof body?.need === "string" ? body.need.slice(0, 40) : "listening";
  await db.listenerQueueEntry.upsert({
    where: { userId: userId },
    create: { userId: userId, need },
    update: { need },
  });
  const position = await db.listenerQueueEntry.count({
    where: { createdAt: { lte: (await db.listenerQueueEntry.findUniqueOrThrow({ where: { userId: userId } })).createdAt } },
  });
  return NextResponse.json({ ok: true, position });
}

export async function DELETE(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });
  await db.listenerQueueEntry.deleteMany({ where: { userId: userId } });
  return NextResponse.json({ ok: true });
}
