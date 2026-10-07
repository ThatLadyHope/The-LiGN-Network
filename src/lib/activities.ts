// LiGN Phase 10 — quiet companionship + shared activities (PRD §35, §36).
// Quiet: together without continuous conversation. Activities: secondary,
// discoverable via Match→Activity or Activity→Match.

export interface QuietSession {
  participantIds: string[];
  endsAt: string;
  voiceOptional: boolean;
  active: boolean;
}

export function startQuietSession(
  participantIds: string[],
  endsAt: string,
  voiceOptional = false,
): QuietSession {
  if (participantIds.length < 2) throw new Error("quiet: needs company");
  return { participantIds, endsAt, voiceOptional, active: true };
}

// Invariant: continuous conversation is never required in quiet company.
export function requiresConversation(): false {
  return false;
}

export const ActivityKind = {
  WATCH: "watching",
  GAMES: "simple-games",
  STUDY: "studying",
  WORK: "working",
  EAT: "eating",
  WALK: "walking",
  DRAW: "drawing",
  MUSIC: "music",
  HANGOUT: "hanging-out",
} as const;
export type ActivityKind = (typeof ActivityKind)[keyof typeof ActivityKind];

export const ActivityPath = {
  MATCH_TO_ACTIVITY: "match-to-activity",
  ACTIVITY_TO_MATCH: "activity-to-match",
} as const;
export type ActivityPath = (typeof ActivityPath)[keyof typeof ActivityPath];

export interface PlannedActivity {
  kind: ActivityKind;
  path: ActivityPath;
}

// Invariant: activities stay secondary to the human connection itself.
export function activitiesSecondary(): true {
  return true;
}

export function planActivity(kind: ActivityKind, path: ActivityPath): PlannedActivity {
  return { kind, path };
}
