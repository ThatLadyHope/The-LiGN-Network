import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { AGREEMENT_TEXT, AGREEMENT_VERSION } from "@/lib/agreement";

// POST /api/agreements/accept — record acceptance of the CURRENT version.
// Idempotent per (user, version): history rows are never overwritten.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  await db.agreementAcceptance.upsert({
    where: { userId_version: { userId: session.user.id, version: AGREEMENT_VERSION } },
    create: {
      userId: session.user.id,
      version: AGREEMENT_VERSION,
      textSnapshot: AGREEMENT_TEXT,
      status: "accepted",
    },
    update: {},
  });
  await db.user.update({
    where: { id: session.user.id },
    data: { agreementVersion: AGREEMENT_VERSION },
  });
  return NextResponse.json({ ok: true, version: AGREEMENT_VERSION });
}

// GET /api/agreements/mine — my own acceptance receipt (transparency).
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const records = await db.agreementAcceptance.findMany({
    where: { userId: session.user.id },
    orderBy: { acceptedAt: "asc" },
    select: { version: true, status: true, acceptedAt: true },
  });
  return NextResponse.json({ records, current: AGREEMENT_VERSION });
}
