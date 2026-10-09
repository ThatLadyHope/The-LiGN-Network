import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// GET /api/listeners/mode — am I in Listener Mode?
// POST /api/listeners/mode { on: boolean } — voluntary opt-in/out, anytime.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { listenerMode: true },
  });
  return NextResponse.json({ on: me?.listenerMode ?? false });
}

export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (typeof body?.on !== "boolean") {
    return NextResponse.json({ error: "invalid-mode" }, { status: 400 });
  }
  await db.user.update({ where: { id: session.user.id }, data: { listenerMode: body.on } });
  return NextResponse.json({ ok: true, on: body.on });
}
