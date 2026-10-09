import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { deletionIsEffective } from "@/lib/account";

// POST /api/account/restore — cancel a pending deletion within the window
// (30 days) by simply being signed in. Past the window: too late.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { pendingDeletionAt: true },
  });
  if (!me?.pendingDeletionAt) return NextResponse.json({ error: "nothing-pending" }, { status: 409 });
  if (deletionIsEffective(new Date(), { requestedAt: "", effectiveAt: me.pendingDeletionAt.toISOString() })) {
    return NextResponse.json({ error: "too-late" }, { status: 410 });
  }
  await db.user.update({
    where: { id: session.user.id },
    data: { pendingDeletionAt: null, accountState: "ACTIVE", discoveryState: "DISCOVERABLE" },
  });
  return NextResponse.json({ ok: true });
}
