import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { MessageContent } from "@/lib/messaging";

async function myOpenSpace(userId: string, id: string) {
  const space = await db.temporarySpace.findUnique({
    where: { id },
    include: { participants: true },
  });
  if (!space) return null;
  if (!space.participants.some((p) => p.userId === userId)) return null;
  if (space.state !== "open" || new Date() >= space.closesAt) return null;
  return space;
}

// GET — space messages, oldest first. Members of an OPEN space only.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await myOpenSpace(session.user.id, params.id);
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const messages = await db.message.findMany({
    where: { spaceId: params.id, deleted: false },
    orderBy: { createdAt: "asc" },
    take: 200,
  });
  return NextResponse.json({ messages });
}

// POST — text only, open spaces, members only.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const space = await myOpenSpace(session.user.id, params.id);
  if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const parsed = MessageContent.safeParse({ text: body?.text });
  if (!parsed.success) return NextResponse.json({ error: "invalid-message" }, { status: 400 });

  const message = await db.message.create({
    data: { spaceId: params.id, senderId: session.user.id, content: parsed.data.text },
  });
  return NextResponse.json({ ok: true, message });
}
