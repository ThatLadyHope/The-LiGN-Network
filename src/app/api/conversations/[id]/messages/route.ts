import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { MessageContent } from "@/lib/messaging";

async function myConversation(userId: string, id: string) {
  const conversation = await db.conversation.findUnique({
    where: { id },
    include: { connection: true },
  });
  if (
    !conversation ||
    (conversation.connection.userAId !== userId &&
      conversation.connection.userBId !== userId)
  ) {
    return null;
  }
  return conversation;
}

// GET — latest 100 messages, oldest first. Members only.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const conversation = await myConversation(userId, params.id);
  if (!conversation) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const messages = await db.message.findMany({
    where: { conversationId: params.id, deleted: false },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  return NextResponse.json({ messages, state: conversation.connection.state });
}

// POST — text only, ACTIVE connections, members only.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const conversation = await myConversation(userId, params.id);
  if (!conversation) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (conversation.connection.state !== "ACTIVE") {
    return NextResponse.json({ error: "connection-not-active" }, { status: 409 });
  }
  // Listening sessions are time-limited: expiry ends the connection.
  if (conversation.connection.endsAt && new Date() >= conversation.connection.endsAt) {
    await db.connection.update({
      where: { id: conversation.connection.id },
      data: { state: "ENDED", endedAt: new Date() },
    });
    return NextResponse.json({ error: "session-ended" }, { status: 409 });
  }
  const body = await req.json().catch(() => null);
  const parsed = MessageContent.safeParse({ text: body?.text });
  if (!parsed.success) return NextResponse.json({ error: "invalid-message" }, { status: 400 });

  const message = await db.message.create({
    data: { conversationId: params.id, senderId: userId, content: parsed.data.text },
  });
  return NextResponse.json({ ok: true, message });
}
