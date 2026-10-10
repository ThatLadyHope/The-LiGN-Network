import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

function toView(m: {
  id: string;
  participantA: string;
  participantB: string;
  content: string;
  approvedA: boolean;
  approvedB: boolean;
  withdrawnBy: string[];
  createdAt: Date;
}) {
  return {
    id: m.id,
    participants: [m.participantA, m.participantB],
    content: m.content,
    approvals: [m.approvedA, m.approvedB],
    withdrawnBy: m.withdrawnBy,
    createdAt: m.createdAt,
  };
}

// GET /api/memories — shared memories I'm part of and haven't withdrawn from.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const all = await db.sharedMemory.findMany({
    where: { OR: [{ participantA: session.user.id }, { participantB: session.user.id }] },
    orderBy: { createdAt: "desc" },
  });
  const mine = all.filter((m) => !m.withdrawnBy.includes(session.user.id));
  const otherIds = mine.map((m) =>
    m.participantA === session.user.id ? m.participantB : m.participantA,
  );
  const others = await db.user.findMany({
    where: { id: { in: otherIds } },
    select: { id: true, nickname: true },
  });
  const names = new Map(others.map((o) => [o.id, o.nickname]));
  return NextResponse.json({
    memories: mine.map((m) => ({
      ...toView(m),
      otherNickname: names.get(
        m.participantA === session.user.id ? m.participantB : m.participantA,
      ) ?? "Someone",
      myIndex: m.participantA === session.user.id ? 0 : 1,
    })),
  });
}

// POST /api/memories { otherId, content } — propose; creator auto-approves,
// the other approves separately. Both required before it counts as shared.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const otherId = body?.otherId;
  const content = typeof body?.content === "string" ? body.content.trim().slice(0, 2000) : "";
  if (typeof otherId !== "string" || !otherId || otherId === session.user.id || !content) {
    return NextResponse.json({ error: "invalid-memory" }, { status: 400 });
  }
  const other = await db.user.findUnique({ where: { id: otherId }, select: { id: true } });
  if (!other) return NextResponse.json({ error: "not-found" }, { status: 404 });

  const created = await db.sharedMemory.create({
    data: {
      participantA: session.user.id,
      participantB: otherId,
      content,
      approvedA: true,
      approvedB: false,
    },
  });
  return NextResponse.json({ ok: true, memory: toView(created) });
}
