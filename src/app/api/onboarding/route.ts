import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { AgeRange, ConnectionIntention } from "@/lib/profile";
import { AGREEMENT_TEXT, AGREEMENT_VERSION, acceptanceValid } from "@/lib/agreement";

// PRD §75: progressive onboarding. Creates the LOCAL LiGN profile on first
// call (Clerk owns identity; we own the profile, one per Clerk id), then
// updates it. Agreement acceptance is enforced here, server-side, with a
// persisted versioned record — never on client word alone.
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const nickname = typeof body?.nickname === "string" ? body.nickname.trim() : "";
  if (nickname.length < 1 || nickname.length > 30) {
    return NextResponse.json({ error: "invalid-nickname" }, { status: 400 });
  }
  if (!acceptanceValid(body?.agreementVersion)) {
    return NextResponse.json({ error: "agreement-required" }, { status: 400 });
  }
  const data: { nickname: string; ageRange?: string; language?: string; currentNeeds?: string[] } = {
    nickname,
  };
  if (body?.ageRange !== undefined) {
    const r = AgeRange.safeParse(body.ageRange);
    if (!r.success) return NextResponse.json({ error: "invalid-age" }, { status: 400 });
    data.ageRange = r.data;
  }
  if (body?.language !== undefined) {
    const r = z.string().min(2).max(10).safeParse(body.language);
    if (!r.success) return NextResponse.json({ error: "invalid-language" }, { status: 400 });
    data.language = r.data;
  }
  if (body?.currentNeeds !== undefined) {
    const r = z.array(ConnectionIntention).min(1).safeParse(body.currentNeeds);
    if (!r.success) return NextResponse.json({ error: "invalid-needs" }, { status: 400 });
    data.currentNeeds = r.data;
  }

  const existing = await db.user.findUnique({ where: { clerkId } });
  let localId: string;
  if (existing) {
    await db.user.update({ where: { id: existing.id }, data });
    localId = existing.id;
  } else {
    const cu = await currentUser();
    const email = cu?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "email-required" }, { status: 400 });
    const created = await db.user.create({
      data: { clerkId, email, agreementVersion: AGREEMENT_VERSION, ...data },
    });
    localId = created.id;
  }
  try {
    await db.agreementAcceptance.upsert({
      where: { userId_version: { userId: localId, version: AGREEMENT_VERSION } },
      create: {
        userId: localId,
        version: AGREEMENT_VERSION,
        textSnapshot: AGREEMENT_TEXT,
        status: "accepted",
      },
      update: {},
    });
  } catch {
    // Fail closed: no record, no profile.
    if (!existing) await db.user.delete({ where: { id: localId } }).catch(() => null);
    return NextResponse.json({ error: "acceptance-failed" }, { status: 500 });
  }
  await db.user.update({ where: { id: localId }, data: { agreementVersion: AGREEMENT_VERSION } });
  return NextResponse.json({ ok: true });
}
