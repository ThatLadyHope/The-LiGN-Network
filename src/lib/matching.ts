// LiGN Phase 4 — need-first matching (PRD §12, §13).
// Eligibility runs before scoring. Current need is the strongest signal.
// By construction there are NO popularity/appearance/follower inputs,
// so matching cannot prioritize them. Never fabricates a human.
import type { ConnectionIntention } from "./profile";

export interface MatchCandidate {
  id: string;
  needs: ConnectionIntention[];
  availabilityTypes: string[];
  depth: string | null;
  styles: string[];
  personality: string[];
  interests: string[];
  /** Opt-in tags only, never inferred (sensitive signal). */
  lifeExperience: string[];
  language: string | null;
  timezone: string | null;
  location: string | null;
  // Eligibility inputs (§13):
  blockedByViewer: boolean;
  blockedViewer: boolean;
  ageBlocked: boolean;
  safetyBlocked: boolean;
  discoverable: boolean;
  userRestricted: boolean;
  previouslyRejected: boolean;
  alreadyConnected: boolean;
}

export interface MatchViewer {
  needs: ConnectionIntention[];
  availabilityTypes: string[];
  depth: string | null;
  styles: string[];
  personality: string[];
  interests: string[];
  lifeExperience: string[];
  language: string | null;
  timezone: string | null;
  location: string | null;
}

// PRD §13 — hard filters, evaluated before any scoring.
export function isEligible(viewer: MatchViewer, candidate: MatchCandidate): boolean {
  void viewer;
  if (candidate.blockedByViewer || candidate.blockedViewer) return false;
  if (candidate.ageBlocked || candidate.safetyBlocked) return false;
  if (!candidate.discoverable) return false;
  if (candidate.userRestricted) return false;
  if (candidate.previouslyRejected) return false;
  if (candidate.alreadyConnected) return false;
  return true;
}

function overlap(a: string[], b: string[]): number {
  return a.filter((x) => b.includes(x)).length;
}

// Need compatibility (§12, refined): support needs pair COMPLEMENTARILY —
// a listener needs someone talking (vent / need-someone), never another
// listener. All other needs pair with their own kind (mirror).
const NEED_COMPAT: Record<ConnectionIntention, ConnectionIntention[]> = {
  listening: ["venting", "need-someone"],
  venting: ["listening"],
  "need-someone": ["listening"],
  "casual-chat": ["casual-chat"],
  "deep-conversation": ["deep-conversation"],
  "check-ins": ["check-ins"],
  friendship: ["friendship"],
  "pen-pal": ["pen-pal"],
  "quiet-companionship": ["quiet-companionship"],
  "shared-activity": ["shared-activity"],
};
// PRD §12 priority: need > availability > depth > style > personality >
// interests > life-experience > language > timezone > location.
// Weights encode the order; need dominates by design.
const WEIGHTS = {
  need: 100,
  availability: 40,
  depth: 25,
  style: 20,
  personality: 15,
  language: 12,
  interests: 10,
  lifeExperience: 8,
  timezone: 5,
  location: 5,
} as const;

export interface ScoredCandidate {
  id: string;
  score: number;
  sharedNeeds: ConnectionIntention[];
}

export function scoreCompatibility(viewer: MatchViewer, candidate: MatchCandidate): ScoredCandidate {
  // Compatible needs (not mere overlap): each viewer need satisfied by a
  // complementary candidate need counts once. `sharedNeeds` carries the
  // candidate-side needs that matched, for display as chips.
  const sharedNeeds: ConnectionIntention[] = [];
  let pairs = 0;
  for (const n of viewer.needs) {
    const hit = candidate.needs.find((c) => (NEED_COMPAT[n] ?? []).includes(c));
    if (hit && !sharedNeeds.includes(hit)) {
      pairs += 1;
      sharedNeeds.push(hit);
    }
  }
  const score =
    pairs * WEIGHTS.need +
    overlap(candidate.availabilityTypes, viewer.availabilityTypes) * WEIGHTS.availability +
    (candidate.depth && viewer.depth && candidate.depth === viewer.depth ? WEIGHTS.depth : 0) +
    overlap(candidate.styles, viewer.styles) * WEIGHTS.style +
    overlap(candidate.personality, viewer.personality) * WEIGHTS.personality +
    (candidate.language && viewer.language && candidate.language === viewer.language
      ? WEIGHTS.language
      : 0) +
    overlap(candidate.interests, viewer.interests) * WEIGHTS.interests +
    overlap(candidate.lifeExperience, viewer.lifeExperience) * WEIGHTS.lifeExperience +
    (candidate.timezone && viewer.timezone && candidate.timezone === viewer.timezone
      ? WEIGHTS.timezone
      : 0) +
    (candidate.location && viewer.location && candidate.location === viewer.location
      ? WEIGHTS.location
      : 0);
  return { id: candidate.id, score, sharedNeeds };
}

export function rankCandidates(viewer: MatchViewer, candidates: MatchCandidate[]): ScoredCandidate[] {
  return candidates
    .filter((c) => isEligible(viewer, c))
    .map((c) => scoreCompatibility(viewer, c))
    .sort((a, b) => b.score - a.score);
}

// PRD §12 no-match: honest fallback only. NEVER a fabricated human.
export const NoMatchFallback = {
  BROADEN: "broaden-matching",
  TRY_LATER: "try-again-later",
  LISTENER_QUEUE: "listener-queue",
  TEMP_SPACE: "temporary-space",
  ACTIVITY: "shared-activity",
  REFLECTION: "reflection-prompt",
} as const;
export type NoMatchFallback = (typeof NoMatchFallback)[keyof typeof NoMatchFallback];

export function noMatchFallback(): { honest: true; options: NoMatchFallback[] } {
  return {
    honest: true,
    options: [
      NoMatchFallback.BROADEN,
      NoMatchFallback.TRY_LATER,
      NoMatchFallback.LISTENER_QUEUE,
      NoMatchFallback.TEMP_SPACE,
      NoMatchFallback.ACTIVITY,
      NoMatchFallback.REFLECTION,
    ],
  };
}
