import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { AgeRange, ConnectionIntention } from "@/lib/profile";

// PRD §75: progressive onboarding. Step 1 (signup) sends ageRange + language;
// step 2 (needs) sends those plus currentNeeds. Each provided field is
// validated; nickname falls back to the signup name. One identity per account.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "sign-in-required" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const nickname = body?.nickname ?? session.user.name ?? "";
  if (typeof nickname !== "string" || nickname.length < 1 || nickname.length > 30) {
    return NextResponse.json({ error: "invalid-nickname" }, { status: 400 });
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
  await db.user.update({ where: { id: session.user.id }, data });
  return NextResponse.json({ ok: true });
}
