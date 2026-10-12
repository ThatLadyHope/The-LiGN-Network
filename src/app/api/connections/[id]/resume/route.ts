import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { applyConnectionAction } from "@/lib/connections";

// POST /api/connections/[id]/resume — PAUSED → ACTIVE. Either member.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const connection = await db.connection.findUnique({ where: { id: params.id } });
  if (
    !connection ||
    (connection.userAId !== userId && connection.userBId !== userId)
  ) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  try {
    const next = applyConnectionAction(connection.state, "continue");
    await db.connection.update({
      where: { id: connection.id },
      data: { state: next, pausedAt: null },
    });
    return NextResponse.json({ ok: true, state: next });
  } catch {
    return NextResponse.json({ error: "illegal-transition" }, { status: 409 });
  }
}
