import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/reports?openAppeals=1 — every report, newest first; with
// openAppeals, only ones awaiting an appeal decision. Token-gated: appeals
// (with reporter/target linkage) are visible to the developer, never to
// ordinary users through the app.
export async function GET(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.headers.get("x-admin-token") !== token) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const onlyOpen = new URL(req.url).searchParams.get("openAppeals") === "1";
  const reports = await db.report.findMany({
    where: onlyOpen ? { review: "appealed" } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ reports });
}
