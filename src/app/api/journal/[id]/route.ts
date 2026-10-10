import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// DELETE /api/journal/[id] — owner only.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const entry = await db.journalEntry.findUnique({ where: { id: params.id } });
  if (!entry || entry.ownerId !== session.user.id) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  await db.journalEntry.delete({ where: { id: entry.id } });
  return NextResponse.json({ ok: true });
}
