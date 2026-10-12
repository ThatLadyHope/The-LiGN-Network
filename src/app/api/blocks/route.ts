import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";

// POST /api/blocks { userId } — block immediately. Idempotent; the blocked
// party is never told (all user-facing surfaces just say "unavailable").
export async function POST(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const targetId = body?.userId;
  if (typeof targetId !== "string" || !targetId || targetId === userId) {
    return NextResponse.json({ error: "invalid-user" }, { status: 400 });
  }
  const target = await db.user.findUnique({ where: { id: targetId }, select: { id: true } });
  if (!target) return NextResponse.json({ error: "unavailable" }, { status: 404 });

  await db.block.upsert({
    where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
    create: { blockerId: userId, blockedId: targetId },
    update: {},
  });
  return NextResponse.json({ ok: true });
}
