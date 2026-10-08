import { NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { isDiscoverable, type AvailabilityInput } from "@/lib/availability";
import {
  noMatchFallback,
  rankCandidates,
  type MatchCandidate,
  type MatchViewer,
} from "@/lib/matching";

// GET /api/discover — eligible people for the viewer's current needs.
// Eligibility before scoring; honest fallback when nobody qualifies.
export async function GET(req: Request) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: (req as Request).headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    include: { availability: true },
  });
  if (!me) return NextResponse.json({ error: "no-profile" }, { status: 404 });
  if (me.discoveryState !== "DISCOVERABLE" || me.accountState !== "ACTIVE") {
    return NextResponse.json({ candidates: [], fallback: noMatchFallback() });
  }

  const viewer: MatchViewer = {
    needs: me.currentNeeds as MatchViewer["needs"],
    availabilityTypes: me.availability?.types ?? [],
    depth: null,
    styles: [],
    personality: [],
    interests: me.interests,
    lifeExperience: [],
    language: me.language,
    timezone: null,
    location: me.country,
  };

  const others = await db.user.findMany({
    where: { id: { not: me.id }, accountState: "ACTIVE" },
    include: { availability: true },
    take: 50,
  });
  const blocks = await db.block.findMany({
    where: { OR: [{ blockerId: me.id }, { blockedId: me.id }] },
  });
  const iBlocked = new Set(
    blocks.filter((b) => b.blockerId === me.id).map((b) => b.blockedId),
  );
  const blockedMe = new Set(
    blocks.filter((b) => b.blockedId === me.id).map((b) => b.blockerId),
  );
  const existing = await db.connection.findMany({
    where: { OR: [{ userAId: me.id }, { userBId: me.id }] },
  });
  const connectedIds = new Set(
    existing.flatMap((c) => [c.userAId, c.userBId].filter((id) => id !== me.id)),
  );
  const now = new Date();

  const candidates: MatchCandidate[] = others.map((u) => {
    const avail: AvailabilityInput = {
      types: (u.availability?.types ?? []) as AvailabilityInput["types"],
      windows: u.availability?.windows ?? null,
      temp: (u.availability?.tempState as AvailabilityInput["temp"]) ?? "none",
      tempUntil: u.availability?.tempStateUntil?.toISOString() ?? null,
    };
    return {
      id: u.id,
      needs: u.currentNeeds as MatchCandidate["needs"],
      availabilityTypes: u.availability?.types ?? [],
      depth: null,
      styles: [],
      personality: [],
      interests: u.interests,
      lifeExperience: [],
      language: u.language,
      timezone: null,
      location: u.country,
      blockedByViewer: iBlocked.has(u.id),
      blockedViewer: blockedMe.has(u.id),
      ageBlocked: false,
      safetyBlocked: u.safetyState !== "NORMAL",
      discoverable: isDiscoverable("daily", u.discoveryState, avail, now),
      userRestricted: false,
      previouslyRejected: false,
      alreadyConnected: connectedIds.has(u.id),
    };
  });

  const ranked = rankCandidates(viewer, candidates).slice(0, 10);
  if (ranked.length === 0) {
    return NextResponse.json({ candidates: [], fallback: noMatchFallback() });
  }
  const profiles = await db.user.findMany({
    where: { id: { in: ranked.map((r) => r.id) } },
    select: { id: true, nickname: true, bio: true, interests: true, currentNeeds: true },
  });
  const byId = new Map(profiles.map((p) => [p.id, p]));
  return NextResponse.json({
    candidates: ranked.map((r) => ({ ...r, profile: byId.get(r.id) ?? null })),
    fallback: null,
  });
}
