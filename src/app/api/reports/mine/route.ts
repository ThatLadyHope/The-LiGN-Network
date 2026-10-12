import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";

function directionOf(r: { reporterId: string }, me: string): "by-me" | "against-me" {
  return r.reporterId === me ? "by-me" : "against-me";
}

// GET /api/reports/mine — reports I filed plus reports filed against me,
// each with its flow position. Reporter/target identities of OTHER people
// are limited to nicknames (no contact, no evidence).
export async function GET(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const rows = await db.report.findMany({
    where: { OR: [{ reporterId: userId }, { targetId: userId }] },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const otherIds = new Set<string>();
  for (const r of rows) {
    otherIds.add(r.reporterId === userId ? r.targetId : r.reporterId);
  }
  const others = await db.user.findMany({
    where: { id: { in: [...otherIds] } },
    select: { id: true, nickname: true },
  });
  const names = new Map(others.map((o) => [o.id, o.nickname]));
  return NextResponse.json({
    reports: rows.map((r) => ({
      id: r.id,
      direction: directionOf(r, userId),
      category: r.category,
      review: r.review,
      action: r.action,
      appeal: r.appeal,
      createdAt: r.createdAt,
      otherNickname:
        names.get(r.reporterId === userId ? r.targetId : r.reporterId) ?? "Someone",
    })),
  });
}
