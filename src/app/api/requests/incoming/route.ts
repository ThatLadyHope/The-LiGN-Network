import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// GET /api/requests/incoming — pending requests addressed to me.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const pending = await db.connectionRequest.findMany({
    where: { recipientId: session.user.id, state: "pending" },
    orderBy: { createdAt: "desc" },
  });
  const senders = await db.user.findMany({
    where: { id: { in: pending.map((r) => r.senderId) } },
    select: { id: true, nickname: true, bio: true },
  });
  const byId = new Map(senders.map((s) => [s.id, s]));
  return NextResponse.json({
    requests: pending.map((r) => ({ ...r, sender: byId.get(r.senderId) ?? null })),
  });
}
