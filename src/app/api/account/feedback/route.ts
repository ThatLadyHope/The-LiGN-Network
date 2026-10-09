import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

const REASONS = [
  "need-space",
  "not-a-fit",
  "boundary-issue",
  "missing-something",
  "naturally-ended",
  "other",
];

// POST /api/account/feedback { reason, message? } — why someone is leaving.
// Stored privately for product learning; never conditions deletion.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!REASONS.includes(body?.reason)) {
    return NextResponse.json({ error: "invalid-reason" }, { status: 400 });
  }
  const message =
    typeof body?.message === "string" && body.message.trim()
      ? body.message.slice(0, 2000)
      : null;
  await db.deletionFeedback.create({
    data: { userId: session.user.id, reason: body.reason, message },
  });
  return NextResponse.json({ ok: true });
}
