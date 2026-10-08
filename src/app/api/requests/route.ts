import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/connections";

// POST /api/requests { recipientId, reason?, note? } — sends a connection request.
// Mutual interest enforced later at accept time; duplicates and self-requests rejected.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const recipientId = body?.recipientId;
  if (typeof recipientId !== "string" || !recipientId) {
    return NextResponse.json({ error: "invalid-recipient" }, { status: 400 });
  }
  try {
    validateRequest({
      senderId: session.user.id,
      recipientId,
      reason: body?.reason ?? null,
      note: body?.note ?? null,
    });
  } catch {
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  }
  const blocked = await db.block.findFirst({
    where: {
      OR: [
        { blockerId: session.user.id, blockedId: recipientId },
        { blockerId: recipientId, blockedId: session.user.id },
      ],
    },
  });
  if (blocked) return NextResponse.json({ error: "unavailable" }, { status: 404 });
  const target = await db.user.findUnique({
    where: { id: recipientId },
    select: { id: true, accountState: true, discoveryState: true },
  });
  if (!target || target.accountState !== "ACTIVE" || target.discoveryState !== "DISCOVERABLE") {
    return NextResponse.json({ error: "unavailable" }, { status: 404 });
  }
  const dupe = await db.connectionRequest.findFirst({
    where: { senderId: session.user.id, recipientId, state: "pending" },
  });
  if (dupe) return NextResponse.json({ error: "already-pending", id: dupe.id }, { status: 409 });

  const created = await db.connectionRequest.create({
    data: {
      senderId: session.user.id,
      recipientId,
      note: typeof body?.note === "string" ? body.note.slice(0, 500) : null,
      state: "pending",
    },
  });
  return NextResponse.json({ ok: true, id: created.id });
}
