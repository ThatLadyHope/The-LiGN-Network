import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { COOLING_OFF_DAYS, deletionBlockedBySafety, deletionConsequences, requestDeletion } from "@/lib/account";

// GET /api/account/delete — the consequences list (shown BEFORE confirmation).
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });
  return NextResponse.json({ consequences: deletionConsequences(), coolingOffDays: COOLING_OFF_DAYS });
}

// POST /api/account/delete { confirm: true } — request deletion with cooling-off.
// Never bypasses an active safety hold.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (body?.confirm !== true) return NextResponse.json({ error: "confirm-required" }, { status: 400 });

  const hold = await db.report.findFirst({
    where: { targetId: session.user.id, review: { in: ["pending", "protecting", "in-review"] } },
  });
  if (deletionBlockedBySafety(!!hold)) {
    return NextResponse.json({ error: "safety-hold" }, { status: 409 });
  }
  const request = requestDeletion(new Date());
  await db.user.update({
    where: { id: session.user.id },
    data: {
      accountState: "PAUSED",
      discoveryState: "NOT_DISCOVERABLE",
      pendingDeletionAt: new Date(request.effectiveAt),
    },
  });
  return NextResponse.json({ ok: true, effectiveAt: request.effectiveAt });
}
