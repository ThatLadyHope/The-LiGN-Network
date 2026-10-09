// LiGN Phase 6 — temporary spaces, 3–8 only, never permanent (PRD §37–§38).
// Groups/board stay minimal: opportunities list only, no feed, no obligations.
export const DurationPreset = {
  MIN_15: 15,
  MIN_30: 30,
  HOUR_1: 60,
  HOUR_2: 120,
} as const;

export const MIN_PARTICIPANTS = 3;
export const MAX_PARTICIPANTS = 8;
export const MAX_CUSTOM_MIN = 240; // Assumption (max 4h) — PRD gives no configured limit.
export const MIN_CUSTOM_MIN = 5; // Assumption — below this a "space" is a chat.
export const REPORT_WINDOW_DAYS = 30; // Assumption — evidence hold after closure.

export const SpaceState = {
  OPEN: "open",
  CLOSED: "closed",
  EXPIRED: "expired",
} as const;
export type SpaceState = (typeof SpaceState)[keyof typeof SpaceState];

export interface SpaceInput {
  creatorId: string;
  purpose: string;
  durationMin: number;
  capacity: number;
}

export function validateSpace(input: SpaceInput): void {
  if (!input.purpose.trim()) throw new Error("space: purpose required");
  const known = Object.values(DurationPreset) as number[];
  const customOk =
    input.durationMin >= MIN_CUSTOM_MIN && input.durationMin <= MAX_CUSTOM_MIN;
  if (!known.includes(input.durationMin) && !customOk) {
    throw new Error("space: duration outside configured limits");
  }
  if (input.capacity < MIN_PARTICIPANTS || input.capacity > MAX_PARTICIPANTS) {
    throw new Error("space: capacity must be 3–8");
  }
}

export interface SpaceParticipant {
  userId: string;
  joinedAt: string;
}

export interface SpaceSnapshot {
  state: SpaceState;
  creatorId: string;
  participants: SpaceParticipant[];
  closesAt: string;
}

export function isExpired(space: SpaceSnapshot, now: Date): boolean {
  return now.getTime() >= new Date(space.closesAt).getTime();
}

// Expiry closes the space; normal participation stops at closure.
export function expireSpace(space: SpaceSnapshot, now: Date): SpaceSnapshot {
  if (space.state !== "open") return space;
  if (!isExpired(space, now)) return space;
  return { ...space, state: "expired" };
}

export function joinSpace(space: SpaceSnapshot, userId: string, now: Date): SpaceSnapshot {
  if (space.state !== "open" || isExpired(space, now)) {
    throw new Error("space: cannot join a closed space");
  }
  if (space.participants.length >= MAX_PARTICIPANTS) {
    throw new Error("space: at capacity");
  }
  if (space.participants.some((p) => p.userId === userId)) return space;
  return {
    ...space,
    participants: [...space.participants, { userId, joinedAt: now.toISOString() }],
  };
}

export function leaveSpace(space: SpaceSnapshot, userId: string): SpaceSnapshot {
  return { ...space, participants: space.participants.filter((p) => p.userId !== userId) };
}

// Creator-leave: unspecified in PRD (open question). Assumption: ownership
// transfers to the earliest-joined remaining participant; if none remain,
// the space closes. Never becomes permanent either way.
export function creatorLeave(space: SpaceSnapshot, now: Date): SpaceSnapshot {
  void now;
  const rest = space.participants.filter((p) => p.userId !== space.creatorId);
  if (rest.length === 0) return { ...space, participants: [], state: "closed" };
  const next = [...rest].sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))[0];
  return { ...space, creatorId: next.userId, participants: rest };
}

export function closeEarly(space: SpaceSnapshot, requesterId: string): SpaceSnapshot {
  if (requesterId !== space.creatorId) throw new Error("space: only creator ends early");
  if (space.state !== "open") throw new Error("space: already closed");
  return { ...space, state: "closed" };
}

// Reports remain possible inside the evidence window after closure.
export function reportAllowedAfterClosure(closedAt: Date, now: Date): boolean {
  return (now.getTime() - closedAt.getTime()) / 86400000 <= REPORT_WINDOW_DAYS;
}

// Post-space: private talk-again; a new connection exists ONLY on mutual interest.
export function postSpaceReconnect(
  aWantsAgain: boolean,
  bWantsAgain: boolean,
): { connected: boolean; disclosed: boolean } {
  const connected = aWantsAgain && bWantsAgain;
  // Unilateral interest is never disclosed.
  return { connected, disclosed: connected };
}

// Mutual-pair detection over stored wishes: returns pairs (a,b) where both
// wished for each other. Unmatched wishes stay silent.
export function findMutualPairs(
  wishes: { wanterId: string; wantedId: string }[],
): [string, string][] {
  const want = new Set(wishes.map((w) => `${w.wanterId}>${w.wantedId}`));
  const pairs: [string, string][] = [];
  const seen = new Set<string>();
  for (const w of wishes) {
    const key = [w.wanterId, w.wantedId].sort().join(">");
    if (!seen.has(key) && want.has(`${w.wantedId}>${w.wanterId}`)) {
      seen.add(key);
      pairs.push([w.wanterId, w.wantedId]);
    }
  }
  return pairs;
}
