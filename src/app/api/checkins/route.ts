import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { gentleStreak, isCheckinMood, isDayKey, todayKey } from "@/lib/checkins";

// GET /api/checkins — my recent check-ins (latest 30) + gentle-day streak.
export async function GET() {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const rows = await db.checkIn.findMany({
    where: { userId },
    orderBy: { day: "desc" },
    take: 30,
    select: { day: true, mood: true },
  });
  const today = rows.find((r) => r.day === todayKey());
  return NextResponse.json({
    checkins: rows,
    streak: gentleStreak(rows.map((r) => r.day)),
    today: today ?? null,
  });
}

// POST /api/checkins { mood, day } — record (or re-record) today's arrival.
// One row per user per day; retakes overwrite, never duplicate.
export async function POST(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!isCheckinMood(body?.mood)) {
    return NextResponse.json({ error: "invalid-mood" }, { status: 400 });
  }
  if (!isDayKey(body?.day)) {
    return NextResponse.json({ error: "invalid-day" }, { status: 400 });
  }
  const saved = await db.checkIn.upsert({
    where: { userId_day: { userId, day: body.day } },
    create: { userId, day: body.day, mood: body.mood },
    update: { mood: body.mood },
    select: { day: true, mood: true },
  });
  return NextResponse.json({ ok: true, checkin: saved });
}
