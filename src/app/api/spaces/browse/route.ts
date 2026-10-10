import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";

// GET /api/spaces/browse — open, unexpired spaces I'm not in and that are
// not full. Purpose + headcount only; nicknames stay inside the room.
export async function GET(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const open = await db.temporarySpace.findMany({
    where: { state: "open", closesAt: { gt: new Date() } },
    include: { participants: true },
    orderBy: { createdAt: "asc" },
    take: 20,
  });
  return NextResponse.json({
    spaces: open
      .filter(
        (s) =>
          !s.participants.some((p) => p.userId === session.user.id) &&
          s.participants.length < s.capacity,
      )
      .map((s) => ({
        id: s.id,
        purpose: s.purpose,
        seats: s.capacity - s.participants.length,
        closesAt: s.closesAt,
      })),
  });
}
