import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { OnboardingMinimal } from "@/lib/profile";

// PRD §75: minimal onboarding only. Requires a signed-in session (one identity).
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "sign-in-required" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = OnboardingMinimal.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid-profile", issues: parsed.error.issues }, { status: 400 });
  }
  const { nickname, ageRange, currentNeeds, language } = parsed.data;
  await db.user.update({
    where: { id: session.user.id },
    data: { nickname, ageRange, currentNeeds, language },
  });
  return NextResponse.json({ ok: true });
}
