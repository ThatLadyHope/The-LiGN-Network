import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { endConnection, EndReason } from "@/lib/connections";

const REASONS = ["need-space", "not-a-fit", "boundary-issue", "naturally-ended", "unspecified"] as const;

// POST /api/connections/[id]/end { reason?, closingMessage? } — end without
// explanation required. Records the ender for reconnection control.
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
  const body = await req.json().catch(() => null);
  const reason = REASONS.includes(body?.reason) ? body.reason : "unspecified";
  const closing =
    typeof body?.closingMessage === "string" && body.closingMessage.trim()
      ? body.closingMessage.slice(0, 500)
      : null;
  try {
    const result = endConnection(connection.state, session.user.id, reason as EndReason, closing);
    await db.connection.update({
      where: { id: connection.id },
      data: { state: result.state, endedAt: new Date(), enderId: result.enderId },
    });
    return NextResponse.json({ ok: true, state: "ENDED" });
  } catch {
    return NextResponse.json({ error: "illegal-transition" }, { status: 409 });
  }
}
