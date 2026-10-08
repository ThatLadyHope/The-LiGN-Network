import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { respondToRequest } from "@/lib/connections";

// POST /api/requests/[id]/respond { action: "accept" | "decline" }
// Accept requires the recipient's interest (mutual): creates the ACTIVE
// connection plus its conversation in one step. Decline resets to stranger.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const action = body?.action;
  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ error: "invalid-action" }, { status: 400 });
  }
  const request = await db.connectionRequest.findUnique({ where: { id: params.id } });
  if (!request || request.recipientId !== session.user.id || request.state !== "pending") {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  const next = respondToRequest("CONVERSATION", action === "accept" ? "accepted" : "declined");
  await db.connectionRequest.update({
    where: { id: request.id },
    data: { state: action === "accept" ? "accepted" : "declined" },
  });

  if (next === "MUTUAL_CONNECTION") {
    const connection = await db.connection.create({
      data: {
        userAId: request.senderId,
        userBId: request.recipientId,
        state: "ACTIVE",
      },
    });
    const conversation = await db.conversation.create({
      data: { connectionId: connection.id, type: "one-on-one" },
    });
    return NextResponse.json({ ok: true, connectionId: connection.id, conversationId: conversation.id });
  }
  return NextResponse.json({ ok: true, connectionId: null, conversationId: null });
}
