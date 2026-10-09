import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// GET /api/profile — my own profile (private to me).
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      nickname: true,
      bio: true,
      country: true,
      interests: true,
      ageRange: true,
      language: true,
      currentNeeds: true,
    },
  });
  if (!me) return NextResponse.json({ error: "no-profile" }, { status: 404 });
  return NextResponse.json({ profile: me });
}

const EditableProfile = z.object({
  bio: z.string().max(500).nullable().optional(),
  country: z.string().max(60).nullable().optional(),
  interests: z.array(z.string().max(40)).max(30).optional(),
});

// PUT /api/profile — progressive profiling: bio, country, interests only.
// Identity (nickname), age, and needs stay on their own flows.
export async function PUT(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = EditableProfile.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid-profile" }, { status: 400 });

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(parsed.data.bio !== undefined ? { bio: parsed.data.bio } : {}),
      ...(parsed.data.country !== undefined ? { country: parsed.data.country } : {}),
      ...(parsed.data.interests !== undefined ? { interests: parsed.data.interests } : {}),
    },
    select: {
      nickname: true,
      bio: true,
      country: true,
      interests: true,
      ageRange: true,
      language: true,
      currentNeeds: true,
    },
  });
  return NextResponse.json({ ok: true, profile: updated });
}
