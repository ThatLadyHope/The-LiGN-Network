// LiGN Phase 7 — boundaries + progressive disclosure (PRD §41, §42).
export const BoundaryPreset = {
  NO_NUMBER: "no-number",
  NO_SOCIALS: "no-socials",
  NO_ROMANTIC_SEXUAL: "no-romantic-sexual",
  NO_UNSOLICITED_ADVICE: "no-unsolicited-advice",
  SHORT_ONLY: "short-only",
  RESPECT_PRIVACY: "respect-privacy",
} as const;
export type BoundaryPreset = (typeof BoundaryPreset)[keyof typeof BoundaryPreset];

export interface BoundarySet {
  presets: BoundaryPreset[];
  custom: string[];
}

// Boundaries vary per connection and can change at any time — merge helper.
export function mergeBoundaries(global: BoundarySet, perConnection: BoundarySet): BoundarySet {
  return {
    presets: [...new Set([...global.presets, ...perConnection.presets])],
    custom: [...global.custom, ...perConnection.custom],
  };
}

// PRD §41: repeated requests after refusal may be treated as a boundary issue.
// Assumption — PRD gives no number: 2+ post-refusal requests = violation signal.
export const POST_REFUSAL_THRESHOLD = 2;

export function isBoundaryViolation(postRefusalRequests: number): boolean {
  return postRefusalRequests >= POST_REFUSAL_THRESHOLD;
}

// PRD §41 — progressive disclosure order. Sharing is always voluntary;
// the order only guides UI, never forces or skips consent.
export const DisclosureLevel = {
  NICKNAME: "nickname",
  BASIC: "basic-profile",
  FAMILIAR: "familiar",
  TRUSTED: "trusted-friend",
} as const;
export type DisclosureLevel = (typeof DisclosureLevel)[keyof typeof DisclosureLevel];

const DISCLOSURE_RANK: Record<DisclosureLevel, number> = {
  nickname: 0,
  "basic-profile": 1,
  familiar: 2,
  "trusted-friend": 3,
};

export function isForwardDisclosure(current: DisclosureLevel, next: DisclosureLevel): boolean {
  return DISCLOSURE_RANK[next] >= DISCLOSURE_RANK[current];
}

export const CONTACT_SHARE_REMINDER =
  "You are about to share contact details. This is voluntary and never required.";

// Contact sharing is voluntary; when it happens the UI must show the reminder.
export function contactShareReminder(sharing: boolean): string | null {
  return sharing ? CONTACT_SHARE_REMINDER : null;
}
