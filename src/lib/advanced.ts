// LiGN Phase 11 — advanced spaces/activities/trust/language/matching.
// Invariants hold at every level: 3–8 only, private-only trust, need-first
// matching with no popularity/appearance signals.
import type { MatchCandidate, MatchViewer, ScoredCandidate } from "./matching";
import { scoreCompatibility } from "./matching";

export const AdvancedSpaceTemplate = {
  STUDY_HALL: "study-hall",
  LISTENING_CIRCLE: "listening-circle",
  WALK_TOGETHER: "walk-together",
  MAKE_TOGETHER: "make-together",
} as const;
export type AdvancedSpaceTemplate = (typeof AdvancedSpaceTemplate)[keyof typeof AdvancedSpaceTemplate];

// Templates are presets only: capacity 3–8, auto-close, never permanent.
export function templateCapacity(): { min: 3; max: 8 } {
  return { min: 3, max: 8 };
}

// Advanced trust stays private: longitudinal notes visible to owner only,
// never scores, never rankings, never public.
export interface PrivateTrustNote {
  ownerId: string;
  aboutId: string;
  note: string;
  visibility: "private";
}

export function recordTrustNote(
  ownerId: string,
  aboutId: string,
  note: string,
): PrivateTrustNote {
  return { ownerId, aboutId, note, visibility: "private" };
}

// Expanded language: preferred + fallbacks; translation remains opt-in.
export function resolveLocale(preferred: string, fallbacks: string[], supported: string[]): string {
  if (supported.includes(preferred)) return preferred;
  return fallbacks.find((f) => supported.includes(f)) ?? supported[0];
}

// Sophisticated matching: base need-first score plus a SMALL recency bonus
// capped strictly below one need-weight, so current need still dominates.
export const RECENCY_BONUS_MAX = 50;

export function refinedScore(
  viewer: MatchViewer,
  candidate: MatchCandidate,
  recentSharedTopics: number,
): ScoredCandidate & { refined: number } {
  const base = scoreCompatibility(viewer, candidate);
  const bonus = Math.min(Math.max(recentSharedTopics, 0) * 5, RECENCY_BONUS_MAX);
  return { ...base, refined: base.score + bonus };
}
