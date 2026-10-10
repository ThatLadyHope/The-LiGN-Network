import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/acceptances?userId= — acceptance history + exact text.
// Gated by a shared ADMIN_TOKEN (no admin role exists in the product).
// Ordinary users can never reach another user's records through the app.
export async function GET(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.headers.get("x-admin-token") !== token) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId-required" }, { status: 400 });

  const records = await db.agreementAcceptance.findMany({
    where: { userId },
    orderBy: { acceptedAt: "asc" },
  });
  return NextResponse.json({ records });
}
