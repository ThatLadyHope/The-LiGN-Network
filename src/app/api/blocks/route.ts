import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// POST /api/blocks { userId } — block immediately. Idempotent; the blocked
// party is never told (all user-facing surfaces just say "unavailable").
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const userId = body?.userId;
  if (typeof userId !== "string" || !userId || userId === session.user.id) {
    return NextResponse.json({ error: "invalid-user" }, { status: 400 });
  }
  const target = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!target) return NextResponse.json({ error: "unavailable" }, { status: 404 });

  await db.block.upsert({
    where: { blockerId_blockedId: { blockerId: session.user.id, blockedId: userId } },
    create: { blockerId: session.user.id, blockedId: userId },
    update: {},
  });
  return NextResponse.json({ ok: true });
}
