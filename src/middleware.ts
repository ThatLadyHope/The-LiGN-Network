import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { RATE, checkLimit, clientKey, limitedResponse } from "@/lib/rate-limit";

// Clerk guards identity; the matrix below keeps the abuse gates.
// Single-instance memory store (see rate-limit.ts for the multi-instance note).
export default clerkMiddleware((_, req) => {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/api/")) return NextResponse.next();

  const key = clientKey(req);
  if (path.startsWith("/api/auth/")) {
    if (!checkLimit(`auth:${key}`, RATE.auth)) return limitedResponse();
    return NextResponse.next();
  }
  if (req.method !== "GET") {
    const rule = path.startsWith("/api/reports") ? RATE.report : RATE.write;
    if (!checkLimit(`write:${key}`, rule)) return limitedResponse();
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
