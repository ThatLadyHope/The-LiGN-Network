// LiGN Phase 7 — private trust, conflict, apology, Trusted Person label (PRD §44–§47).
// Nothing here is public: no scores, ratings, leaderboards, or follower counts.

export const FeedbackTag = {
  RESPECTFUL: "respectful",
  GOOD_LISTENER: "good-listener",
  FRIENDLY: "friendly",
  RESPECTS_BOUNDARIES: "respects-boundaries",
  MADE_UNCOMFORTABLE: "made-uncomfortable",
} as const;
export type FeedbackTag = (typeof FeedbackTag)[keyof typeof FeedbackTag];

export interface PrivateFeedback {
  tag: FeedbackTag;
  /** Invariant: feedback is private and never becomes a public score. */
  visibility: "private";
}

export function recordFeedback(tag: FeedbackTag): PrivateFeedback {
  return { tag, visibility: "private" };
}

// PRD §45 — "Something feels off": suggest repair, never require reconciliation.
export const ConflictAction = {
  CLARIFY: "clarify",
  SET_BOUNDARY: "set-boundary",
  PAUSE: "pause",
  LEAVE: "leave",
  REPORT: "report",
} as const;
export type ConflictAction = (typeof ConflictAction)[keyof typeof ConflictAction];

export function conflictActions(): ConflictAction[] {
  return [
    ConflictAction.CLARIFY,
    ConflictAction.SET_BOUNDARY,
    ConflictAction.PAUSE,
    ConflictAction.LEAVE,
    ConflictAction.REPORT,
  ];
}

// PRD §46 — apology acknowledges what happened + harm, never demands forgiveness.
export interface Apology {
  acknowledgesWhatHappened: boolean;
  acknowledgesHarm: boolean;
  demandsForgiveness: boolean;
}

export function isValidApology(a: Apology): boolean {
  return a.acknowledgesWhatHappened && a.acknowledgesHarm && !a.demandsForgiveness;
}

export const ApologyResponse = {
  ACCEPT: "accept",
  IGNORE: "ignore",
  ACKNOWLEDGE: "acknowledge",
  CONTINUE: "continue",
  LEAVE: "leave",
} as const;
export type ApologyResponse = (typeof ApologyResponse)[keyof typeof ApologyResponse];

// Invariant: an apology never erases a report or safety record.
export function apologyClearsRecord(): false {
  return false;
}

// PRD §47 — Trusted Person MVP: private label only. No authority, no access,
// no disclosure. A social relationship, NOT an emergency contact.
export interface TrustedPersonLabel {
  ownerId: string;
  trustedId: string;
  label: "trusted-person";
  grantsAuthority: false;
  grantsMessageAccess: false;
  isEmergencyContact: false;
}

export function labelTrustedPerson(ownerId: string, trustedId: string): TrustedPersonLabel {
  return {
    ownerId,
    trustedId,
    label: "trusted-person",
    grantsAuthority: false,
    grantsMessageAccess: false,
    isEmergencyContact: false,
  };
}
