import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// GET /api/conversations — my ongoing 1-on-1 conversations with the other
// person's nickname and the latest message preview.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const mine = await db.conversation.findMany({
    where: {
      connection: {
        OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
        state: { in: ["ACTIVE", "PAUSED"] },
      },
    },
    include: {
      connection: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
  const otherIds = mine.map((c) =>
    c.connection.userAId === session.user.id ? c.connection.userBId : c.connection.userAId,
  );
  const others = await db.user.findMany({
    where: { id: { in: otherIds } },
    select: { id: true, nickname: true },
  });
  const byId = new Map(others.map((o) => [o.id, o]));
  return NextResponse.json({
    conversations: mine.map((c) => ({
      id: c.id,
      state: c.connection.state,
      other: byId.get(
        c.connection.userAId === session.user.id ? c.connection.userBId : c.connection.userAId,
      ) ?? null,
      preview: c.messages[0]?.content.slice(0, 80) ?? null,
    })),
  });
}
