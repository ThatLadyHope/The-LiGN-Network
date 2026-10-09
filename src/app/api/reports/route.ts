import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { reportAllowedAfterClosure } from "@/lib/spaces";

const CATEGORIES = [
  "ordinary-incompatibility",
  "discomfort",
  "boundary-violation",
  "harassment",
  "serious-violation",
  "credible-threat",
  "exploitation",
  "other-high-risk",
];

// POST /api/reports { targetId, category, evidence?, spaceId? }.
// Space reports accepted during the space and inside the 30-day window after.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (typeof body?.targetId !== "string" || !CATEGORIES.includes(body?.category)) {
    return NextResponse.json({ error: "invalid-report" }, { status: 400 });
  }
  let spaceId: string | null = null;
  if (typeof body?.spaceId === "string") {
    const space = await db.temporarySpace.findUnique({
      where: { id: body.spaceId },
      include: { participants: true },
    });
    if (!space) return NextResponse.json({ error: "not-found" }, { status: 404 });
    const member = space.participants.some((p) => p.userId === session.user.id);
    if (!member) return NextResponse.json({ error: "not-member" }, { status: 403 });
    if (space.state !== "open") {
      // Closed/expired: evidence window still allows reports.
      if (!reportAllowedAfterClosure(space.closesAt, new Date())) {
        return NextResponse.json({ error: "window-closed" }, { status: 409 });
      }
    }
    spaceId = space.id;
  }
  const report = await db.report.create({
    data: {
      reporterId: session.user.id,
      targetId: body.targetId,
      spaceId,
      category: body.category,
      evidence: typeof body?.evidence === "string" ? body.evidence.slice(0, 2000) : null,
      review: "pending",
    },
  });
  return NextResponse.json({ ok: true, id: report.id });
}
