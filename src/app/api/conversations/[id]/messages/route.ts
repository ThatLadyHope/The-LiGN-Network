import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
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
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const conversation = await myConversation(session.user.id, params.id);
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
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const conversation = await myConversation(session.user.id, params.id);
  if (!conversation) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (conversation.connection.state !== "ACTIVE") {
    return NextResponse.json({ error: "connection-not-active" }, { status: 409 });
  }
  const body = await req.json().catch(() => null);
  const parsed = MessageContent.safeParse({ text: body?.text });
  if (!parsed.success) return NextResponse.json({ error: "invalid-message" }, { status: 400 });

  const message = await db.message.create({
    data: { conversationId: params.id, senderId: session.user.id, content: parsed.data.text },
  });
  return NextResponse.json({ ok: true, message });
}
