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
// Also tracks my read position (only when something new arrived, so the 5s
// poll doesn't write every tick) and reports the other side's, which drives
// the honest ✓/✓✓ ticks.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const conversation = await myConversation(userId, params.id);
  if (!conversation) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const otherId =
    conversation.connection.userAId === userId
      ? conversation.connection.userBId
      : conversation.connection.userAId;
  const messages = await db.message.findMany({
    where: { conversationId: params.id, deleted: false },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  const latestOtherAt = messages.reduce<Date | null>((acc, m) => {
    if (m.senderId === userId) return acc;
    const t = new Date(m.createdAt);
    return !acc || t > acc ? t : acc;
  }, null);
  if (latestOtherAt) {
    const myRead = await db.conversationRead.findUnique({
      where: { conversationId_userId: { conversationId: params.id, userId } },
    });
    if (!myRead || latestOtherAt > new Date(myRead.seenAt)) {
      await db.conversationRead.upsert({
        where: { conversationId_userId: { conversationId: params.id, userId } },
        create: { conversationId: params.id, userId, seenAt: new Date() },
        update: { seenAt: new Date() },
      });
    }
  }
  const otherRead = await db.conversationRead.findUnique({
    where: { conversationId_userId: { conversationId: params.id, userId: otherId } },
  });
  return NextResponse.json({
    messages,
    state: conversation.connection.state,
    otherSeenAt: otherRead?.seenAt ? new Date(otherRead.seenAt).toISOString() : null,
  });
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
