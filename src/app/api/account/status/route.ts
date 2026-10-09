import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { isRestoreDue, pauseAccount, resumeAccount } from "@/lib/account";

// GET /api/account/status — my states + pending deletion info.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountState: true, discoveryState: true, returnAt: true, pendingDeletionAt: true },
  });
  if (!me) return NextResponse.json({ error: "no-profile" }, { status: 404 });

  // Automatic restoration: a return date in the past restores on contact.
  // Deletion cooling always wins over restoration.
  if (
    !me.pendingDeletionAt &&
    isRestoreDue(me.accountState, me.returnAt?.toISOString() ?? null, new Date())
  ) {
    const restored = await db.user.update({
      where: { id: session.user.id },
      data: { accountState: "ACTIVE", discoveryState: "DISCOVERABLE", returnAt: null },
      select: { accountState: true, discoveryState: true, returnAt: true, pendingDeletionAt: true },
    });
    return NextResponse.json({ status: restored, restored: true });
  }
  return NextResponse.json({ status: me });
}

// POST /api/account/pause { returnAt? } — leave discovery, keep everything.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountState: true, discoveryState: true, returnAt: true, pendingDeletionAt: true },
  });
  if (!me) return NextResponse.json({ error: "no-profile" }, { status: 404 });
  const body = await req.json().catch(() => null);
  try {
    const next = pauseAccount(
      {
        accountState: me.accountState,
        discoveryState: me.discoveryState,
        returnAt: me.returnAt?.toISOString() ?? null,
        pendingDeletionAt: me.pendingDeletionAt?.toISOString() ?? null,
      },
      typeof body?.returnAt === "string" ? body.returnAt : null,
    );
    await db.user.update({
      where: { id: session.user.id },
      data: {
        accountState: next.accountState,
        discoveryState: next.discoveryState,
        returnAt: next.returnAt,
      },
    });
    return NextResponse.json({ ok: true, status: next });
  } catch {
    return NextResponse.json({ error: "illegal-transition" }, { status: 409 });
  }
}

// DELETE /api/account/status — resume a paused account.
export async function DELETE(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountState: true, discoveryState: true, returnAt: true, pendingDeletionAt: true },
  });
  if (!me) return NextResponse.json({ error: "no-profile" }, { status: 404 });
  try {
    const next = resumeAccount({
      accountState: me.accountState,
      discoveryState: me.discoveryState,
      returnAt: me.returnAt?.toISOString() ?? null,
      pendingDeletionAt: me.pendingDeletionAt?.toISOString() ?? null,
    });
    await db.user.update({
      where: { id: session.user.id },
      data: { accountState: next.accountState, discoveryState: "DISCOVERABLE", returnAt: null },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "illegal-transition" }, { status: 409 });
  }
}
