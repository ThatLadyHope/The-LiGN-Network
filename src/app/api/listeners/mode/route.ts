import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";

// GET /api/listeners/mode — am I in Listener Mode?
// POST /api/listeners/mode { on: boolean } — voluntary opt-in/out, anytime.
export async function GET(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });
  const me = await db.user.findUnique({
    where: { id: userId },
    select: { listenerMode: true },
  });
  return NextResponse.json({ on: me?.listenerMode ?? false });
}

export async function POST(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (typeof body?.on !== "boolean") {
    return NextResponse.json({ error: "invalid-mode" }, { status: 400 });
  }
  await db.user.update({ where: { id: userId }, data: { listenerMode: body.on } });
  return NextResponse.json({ ok: true, on: body.on });
}
