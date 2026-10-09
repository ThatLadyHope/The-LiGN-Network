import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { applyConnectionAction, endConnection, EndReason } from "@/lib/connections";

async function myConnection(userId: string, id: string) {
  const connection = await db.connection.findUnique({ where: { id } });
  if (
    !connection ||
    (connection.userAId !== userId && connection.userBId !== userId)
  ) {
    return null;
  }
  return connection;
}

// POST /api/connections/[id]/pause — ACTIVE → PAUSED. Either member.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const connection = await myConnection(session.user.id, params.id);
  if (!connection) return NextResponse.json({ error: "not-found" }, { status: 404 });
  try {
    const next = applyConnectionAction(connection.state, "pause");
    await db.connection.update({
      where: { id: connection.id },
      data: { state: next, pausedAt: new Date() },
    });
    return NextResponse.json({ ok: true, state: next });
  } catch {
    return NextResponse.json({ error: "illegal-transition" }, { status: 409 });
  }
}
