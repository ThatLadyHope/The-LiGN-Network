// LiGN Phase 4 — availability (PRD §15, §16).
// Pure logic, no DB imports. Temp states affect discovery only — never connections.
export const AvailabilityType = {
  CASUAL_CHAT: "casual-chat",
  VENT_LISTEN: "venting-listening",
  DEEP: "deep-conversation",
  PEN_PAL: "pen-pal",
  CHECK_INS: "check-ins",
  QUIET: "quiet-companionship",
} as const;
export type AvailabilityType = (typeof AvailabilityType)[keyof typeof AvailabilityType];

export const TempState = {
  NONE: "none",
  NEED_SPACE: "need-space",
  LOW_ENERGY: "low-energy",
  JUST_LISTENING: "just-listening",
  BACK_LATER: "back-later",
} as const;
export type TempState = (typeof TempState)[keyof typeof TempState];

export interface AvailabilityInput {
  types: AvailabilityType[];
  /** Declarative windows only in MVP (no calendar logic — scheduling is Phase 10). */
  windows: string | null;
  temp: TempState;
  tempUntil: string | null;
}

export function isTempExpired(tempUntil: string | null, now: Date): boolean {
  if (!tempUntil) return true;
  return now.getTime() >= new Date(tempUntil).getTime();
}

export function effectiveTemp(state: AvailabilityInput, now: Date): TempState {
  if (state.temp === "none") return "none";
  return isTempExpired(state.tempUntil, now) ? "none" : state.temp;
}

// PRD §16: a temporary state never ends existing connections.
// It only softens discovery: NEED_SPACE / LOW_ENERGY opt out of new suggestions.
export function tempBlocksDiscovery(state: AvailabilityInput, now: Date): boolean {
  const t = effectiveTemp(state, now);
  return t === "need-space" || t === "low-energy";
}

// PRD §14 — discovery frequency. Paused affects discovery only, never connections.
export const DiscoveryFrequency = {
  DAILY: "daily",
  WEEKLY: "weekly",
  PAUSED: "paused",
} as const;
export type DiscoveryFrequency = (typeof DiscoveryFrequency)[keyof typeof DiscoveryFrequency];

export function isDiscoverable(
  frequency: DiscoveryFrequency,
  accountDiscovery: "DISCOVERABLE" | "NOT_DISCOVERABLE",
  availability: AvailabilityInput,
  now: Date,
): boolean {
  if (accountDiscovery !== "DISCOVERABLE") return false;
  if (frequency === "paused") return false;
  if (tempBlocksDiscovery(availability, now)) return false;
  return true;
}
