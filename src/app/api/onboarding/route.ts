import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { AgeRange, ConnectionIntention } from "@/lib/profile";
import { AGREEMENT_TEXT, AGREEMENT_VERSION, acceptanceValid } from "@/lib/agreement";
import { isDisposableEmail } from "@/lib/email-policy";

// PRD §75: progressive onboarding. Creates the LOCAL LiGN profile on first
// call (Clerk owns identity; we own the profile, one per Clerk id), then
// updates it. Agreement acceptance is enforced here, server-side, with a
// persisted versioned record — never on client word alone.
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const nickname = typeof body?.nickname === "string" ? body.nickname.trim() : "";
  const nicknameGiven = nickname.length > 0;
  if (nicknameGiven && nickname.length > 30) {
    return NextResponse.json({ error: "invalid-nickname" }, { status: 400 });
  }
  if (!acceptanceValid(body?.agreementVersion)) {
    return NextResponse.json({ error: "agreement-required" }, { status: 400 });
  }
  const data: { nickname?: string; ageRange?: string; language?: string; currentNeeds?: string[] } = {};
  if (nicknameGiven) data.nickname = nickname;
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
  let createdNow = false;
  // Effective email for the throwaway-domain check: stored address for
  // existing rows, Clerk address otherwise. Checked BEFORE any write.
  const storedEmail = existing?.email ?? null;
  const cuPre = existing ? null : await currentUser();
  const effectiveEmail = storedEmail ?? cuPre?.emailAddresses?.[0]?.emailAddress ?? null;
  if (effectiveEmail && isDisposableEmail(effectiveEmail)) {
    // Fail closed: no profile. Remove a just-created Clerk identity so the
    // throwaway address can't linger (never for pre-existing local rows).
    if (!existing) {
      await clerkClient()
        .then((cc) => cc.users.deleteUser(clerkId))
        .catch(() => null);
    }
    return NextResponse.json({ error: "email-not-allowed" }, { status: 400 });
  }
  if (existing) {
    await db.user.update({ where: { id: existing.id }, data });
    localId = existing.id;
  } else {
    const cu = await currentUser();
    const email = cu?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "email-required" }, { status: 400 });
    // Pre-Clerk (Better Auth era) row with the same email: link it to this
    // Clerk identity instead of inserting a duplicate.
    const legacy = await db.user.findUnique({ where: { email } });
    if (legacy) {
      if (legacy.clerkId && legacy.clerkId !== clerkId) {
        return NextResponse.json({ error: "email-in-use" }, { status: 409 });
      }
      await db.user.update({
        where: { id: legacy.id },
        data: { clerkId, agreementVersion: AGREEMENT_VERSION, ...data },
      });
      localId = legacy.id;
    } else {
      // Brand-new profile: nickname is required.
      if (!nicknameGiven) return NextResponse.json({ error: "invalid-nickname" }, { status: 400 });
      const created = await db.user.create({
        data: { clerkId, email, agreementVersion: AGREEMENT_VERSION, nickname, ...data },
      });
      localId = created.id;
      createdNow = true;
    }
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
    // Fail closed: no record, no profile (only remove rows we just made).
    if (createdNow) await db.user.delete({ where: { id: localId } }).catch(() => null);
    return NextResponse.json({ error: "acceptance-failed" }, { status: 500 });
  }
  await db.user.update({ where: { id: localId }, data: { agreementVersion: AGREEMENT_VERSION } });
  return NextResponse.json({ ok: true });
}
