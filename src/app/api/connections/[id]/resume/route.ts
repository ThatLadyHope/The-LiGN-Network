import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { applyConnectionAction } from "@/lib/connections";

// POST /api/connections/[id]/resume — PAUSED → ACTIVE. Either member.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const connection = await db.connection.findUnique({ where: { id: params.id } });
  if (
    !connection ||
    (connection.userAId !== session.user.id && connection.userBId !== session.user.id)
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
