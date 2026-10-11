import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/health — deployment diagnostics. Names and reachability ONLY:
// never values, never secrets. Public by design (contains nothing sensitive).
export async function GET() {
  const url = process.env.DATABASE_URL ?? "";
  let host = "missing";
  try {
    host = new URL(url).hostname.replace(/^db\.[a-z0-9]+\./, "db.***.");
  } catch {
    host = "unparseable";
  }
  let database: string = "unreachable";
  try {
    await db.$queryRawUnsafe("SELECT 1");
    database = "ok";
  } catch {
    database = "unreachable";
  }
  return NextResponse.json({
    ok: database === "ok",
    database,
    dbHost: host,
    authSecret: process.env.BETTER_AUTH_SECRET ? "set" : "missing",
    authUrl: process.env.BETTER_AUTH_URL ?? "missing",
    resend: process.env.RESEND_API_KEY ? "set" : "missing",
    adminToken: process.env.ADMIN_TOKEN ? "set" : "missing",
  });
}
