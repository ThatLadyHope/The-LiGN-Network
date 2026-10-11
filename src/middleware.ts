import { NextRequest, NextResponse } from "next/server";
import { RATE, checkLimit, clientKey, limitedResponse } from "@/lib/rate-limit";

// Central abuse gate: auth endpoints strict, state-changing calls moderate.
// Single-instance memory store (see rate-limit.ts for the multi-instance note).
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/api/")) return NextResponse.next();

  const key = clientKey(req);
  if (path.startsWith("/api/auth/")) {
    const rule = path.includes("password-reset") ? RATE.reset : RATE.auth;
    if (!checkLimit(`auth:${key}`, rule)) return limitedResponse();
    return NextResponse.next();
  }
  if (req.method !== "GET") {
    const rule = path.startsWith("/api/reports") ? RATE.report : RATE.write;
    if (!checkLimit(`write:${key}`, rule)) return limitedResponse();
  }
  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
