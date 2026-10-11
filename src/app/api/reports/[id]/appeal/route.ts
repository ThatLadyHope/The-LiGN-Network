import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { canAppeal } from "@/lib/safety";

// POST /api/reports/[id]/appeal { message? } — only the reported person,
// only while review is underway or decided. Re-appeals overwrite the message,
// never the history.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const report = await db.report.findUnique({ where: { id: params.id } });
  if (!report) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (!canAppeal(report.review, report.targetId === session.user.id)) {
    return NextResponse.json({ error: "cannot-appeal" }, { status: 409 });
  }
  const body = await req.json().catch(() => null);
  const message =
    typeof body?.message === "string" && body.message.trim()
      ? body.message.slice(0, 2000)
      : null;
  await db.report.update({
    where: { id: report.id },
    data: { review: "appealed", appeal: message },
  });
  return NextResponse.json({ ok: true });
}
