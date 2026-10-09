import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { LISTENER_SESSION_MIN } from "@/lib/listening";

// GET /api/listeners/queue — waiting requests, ANONYMOUS: need + wait time
// only. No nicknames, no user ids. Listeners must be in Listener Mode.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { listenerMode: true },
  });
  if (!me?.listenerMode) return NextResponse.json({ error: "listener-mode-required" }, { status: 403 });

  const entries = await db.listenerQueueEntry.findMany({
    where: { userId: { not: session.user.id } },
    orderBy: { createdAt: "asc" },
    take: 20,
  });
  const now = Date.now();
  return NextResponse.json({
    waiting: entries.map((e) => ({
      token: e.id,
      need: e.need,
      waitedMin: Math.max(0, Math.floor((now - e.createdAt.getTime()) / 60000)),
    })),
  });
}

// POST /api/listeners/claim { token } — take a waiting request. Creates a
// time-limited (60 min) ACTIVE connection + conversation; the waiter leaves
// the queue. Identity is revealed only at this point, to these two people.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { listenerMode: true },
  });
  if (!me?.listenerMode) return NextResponse.json({ error: "listener-mode-required" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const entry =
    typeof body?.token === "string"
      ? await db.listenerQueueEntry.findUnique({ where: { id: body.token } })
      : null;
  if (!entry || entry.userId === session.user.id) {
    return NextResponse.json({ error: "gone" }, { status: 404 });
  }
  await db.listenerQueueEntry.delete({ where: { id: entry.id } });
  const connection = await db.connection.create({
    data: {
      userAId: session.user.id,
      userBId: entry.userId,
      state: "ACTIVE",
      endsAt: new Date(Date.now() + LISTENER_SESSION_MIN * 60000),
    },
  });
  const conversation = await db.conversation.create({
    data: { connectionId: connection.id, type: "listening" },
  });
  return NextResponse.json({
    ok: true,
    connectionId: connection.id,
    conversationId: conversation.id,
    endsAt: connection.endsAt,
  });
}
