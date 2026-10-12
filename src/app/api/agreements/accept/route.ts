import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { AGREEMENT_TEXT, AGREEMENT_VERSION } from "@/lib/agreement";

// POST /api/agreements/accept — record acceptance of the CURRENT version.
// Idempotent per (user, version): history rows are never overwritten.
export async function POST(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  await db.agreementAcceptance.upsert({
    where: { userId_version: { userId: userId, version: AGREEMENT_VERSION } },
    create: {
      userId: userId,
      version: AGREEMENT_VERSION,
      textSnapshot: AGREEMENT_TEXT,
      status: "accepted",
    },
    update: {},
  });
  await db.user.update({
    where: { id: userId },
    data: { agreementVersion: AGREEMENT_VERSION },
  });
  return NextResponse.json({ ok: true, version: AGREEMENT_VERSION });
}

// GET /api/agreements/mine — my own acceptance receipt (transparency).
export async function GET(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const records = await db.agreementAcceptance.findMany({
    where: { userId: userId },
    orderBy: { acceptedAt: "asc" },
    select: { version: true, status: true, acceptedAt: true },
  });
  return NextResponse.json({ records, current: AGREEMENT_VERSION });
}
