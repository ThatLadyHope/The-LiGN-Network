import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { validateSpace } from "@/lib/spaces";

// POST /api/spaces { purpose, durationMin, capacity? } — open a 3–8 temporary space.
// Creator joins automatically. Auto-expiry enforced on read; chat UI arrives later.
export async function POST(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const input = {
    creatorId: userId,
    purpose: typeof body?.purpose === "string" ? body.purpose.slice(0, 120) : "",
    durationMin: Number(body?.durationMin) || 30,
    capacity: Math.min(Math.max(Number(body?.capacity) || 8, 3), 8),
  };
  try {
    validateSpace(input);
  } catch {
    return NextResponse.json({ error: "invalid-space" }, { status: 400 });
  }
  const closesAt = new Date(Date.now() + input.durationMin * 60000);
  const space = await db.temporarySpace.create({
    data: {
      creatorId: input.creatorId,
      purpose: input.purpose,
      durationMin: input.durationMin,
      capacity: input.capacity,
      state: "open",
      closesAt,
      participants: { create: { userId: userId } },
    },
    include: { participants: true },
  });
  return NextResponse.json({ ok: true, space });
}

// GET /api/spaces — my spaces. ?state=open (default) | closed | all.
// Closed includes expired + creator-closed: talk-again + reports live there.
export async function GET(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const state = new URL(req.url).searchParams.get("state") ?? "open";
  const where =
    state === "all"
      ? { participants: { some: { userId: userId } } }
      : state === "closed"
        ? {
            participants: { some: { userId: userId } },
            OR: [{ state: "closed" }, { state: "expired" }],
          }
        : {
            state: "open",
            closesAt: { gt: new Date() },
            participants: { some: { userId: userId } },
          };
  const mine = await db.temporarySpace.findMany({
    where,
    include: { participants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ spaces: mine });
}
