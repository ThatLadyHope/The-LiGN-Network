import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// GET /api/journal — my entries, newest first. Owner only, never shared.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const entries = await db.journalEntry.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ entries });
}

// POST /api/journal { content, connectionId? } — private note.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim().slice(0, 2000) : "";
  if (!content) return NextResponse.json({ error: "empty-entry" }, { status: 400 });
  const entry = await db.journalEntry.create({
    data: {
      ownerId: session.user.id,
      connectionId: typeof body?.connectionId === "string" ? body.connectionId : null,
      content,
    },
  });
  return NextResponse.json({ ok: true, entry });
}
