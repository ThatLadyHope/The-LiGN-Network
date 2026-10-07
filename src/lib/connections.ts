// LiGN Phase 5 — connection requests + lifecycle actions (PRD §22–§25, §28–§30).
// Pure logic, no DB imports. Mutual interest is required for everything mutual.
import { canReconnect, canTransition } from "./transitions";
import type { ConnectionState } from "./states";

export const RequestState = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  IGNORED: "ignored",
} as const;
export type RequestState = (typeof RequestState)[keyof typeof RequestState];

export interface ConnectionRequestInput {
  senderId: string;
  recipientId: string;
  /** Sender profile context + reason; optional personalized note. */
  reason: string | null;
  note: string | null;
}

export function validateRequest(input: ConnectionRequestInput): void {
  if (input.senderId === input.recipientId) {
    throw new Error("request: cannot connect to yourself");
  }
  if (input.note && input.note.length > 500) {
    throw new Error("request: note too long");
  }
}

// Accept moves CONVERSATION → MUTUAL_CONNECTION. Decline/ignore end the attempt.
export function respondToRequest(
  state: ConnectionState,
  response: Exclude<RequestState, "pending">,
): ConnectionState {
  if (state !== "CONVERSATION") throw new Error("request: no open conversation");
  if (response === "accepted") {
    if (!canTransition("CONVERSATION", "MUTUAL_CONNECTION")) throw new Error("request: illegal");
    return "MUTUAL_CONNECTION";
  }
  return "STRANGER";
}

// PRD §22: repeated unwanted requests may become a safety concern.
export const UNWANTED_REQUEST_THRESHOLD = 3; // Assumption — PRD gives no number.

export function isRepeatedUnwanted(declinedOrIgnoredCount: number): boolean {
  return declinedOrIgnoredCount >= UNWANTED_REQUEST_THRESHOLD;
}

// PRD §24 — active connection actions. No forced "friendship" label anywhere.
export const ConnectionAction = {
  CONTINUE: "continue",
  PAUSE: "pause",
  ARCHIVE: "archive",
  END: "end",
} as const;
export type ConnectionAction = (typeof ConnectionAction)[keyof typeof ConnectionAction];

export function applyConnectionAction(
  state: ConnectionState,
  action: ConnectionAction,
): ConnectionState {
  switch (action) {
    case "continue":
      if (state === "MUTUAL_CONNECTION" && canTransition("MUTUAL_CONNECTION", "ACTIVE")) {
        return "ACTIVE";
      }
      if (state === "PAUSED" && canTransition("PAUSED", "ACTIVE")) return "ACTIVE";
      throw new Error("action: cannot continue from this state");
    case "pause":
      if (state === "ACTIVE" && canTransition("ACTIVE", "PAUSED")) return "PAUSED";
      throw new Error("action: cannot pause from this state");
    case "archive":
      if (state === "PAUSED" && canTransition("PAUSED", "ARCHIVED")) return "ARCHIVED";
      throw new Error("action: archive only from paused");
    case "end":
      if (state === "ACTIVE" && canTransition("ACTIVE", "ENDED")) return "ENDED";
      if (state === "PAUSED") return "ENDED";
      throw new Error("action: cannot end from this state");
  }
}

// PRD §25 — accepted screen offers actions; NOTHING happens automatically.
export const AcceptedNextAction = {
  CHAT_NOW: "chat-now",
  SEND_MESSAGE: "send-message",
  SAVE_FOR_LATER: "save-for-later",
} as const;
export type AcceptedNextAction = (typeof AcceptedNextAction)[keyof typeof AcceptedNextAction];

export function acceptedNextActions(): AcceptedNextAction[] {
  return [
    AcceptedNextAction.CHAT_NOW,
    AcceptedNextAction.SEND_MESSAGE,
    AcceptedNextAction.SAVE_FOR_LATER,
  ];
}

// PRD §26 — silence is normal. Gentle nudge only after meaningful inactivity,
// with frequency limits. Never implies rejection (no inference exists here).
export const NUDGE_AFTER_DAYS = 7; // Assumption — PRD gives no number.
export const NUDGE_COOLDOWN_DAYS = 14; // Assumption — PRD gives no number.

export function nudgeEligible(
  lastActivityAt: Date,
  lastNudgeAt: Date | null,
  now: Date,
): boolean {
  const inactiveDays = (now.getTime() - lastActivityAt.getTime()) / 86400000;
  if (inactiveDays < NUDGE_AFTER_DAYS) return false;
  if (!lastNudgeAt) return true;
  return (now.getTime() - lastNudgeAt.getTime()) / 86400000 >= NUDGE_COOLDOWN_DAYS;
}

// PRD §27 — one-sided interaction: offers only, no blame, no public status.
export const OneSidedOffer = {
  PAUSE: "pause",
  NEED_SPACE: "need-space",
  END: "end",
  RECONNECT_LATER: "reconnect-later",
} as const;
export type OneSidedOffer = (typeof OneSidedOffer)[keyof typeof OneSidedOffer];

export function oneSidedOffers(): OneSidedOffer[] {
  return [
    OneSidedOffer.PAUSE,
    OneSidedOffer.NEED_SPACE,
    OneSidedOffer.END,
    OneSidedOffer.RECONNECT_LATER,
  ];
}

// PRD §28 — end without explanation. Optional reason + closing message.
export const EndReason = {
  NEED_SPACE: "need-space",
  NOT_A_FIT: "not-a-fit",
  BOUNDARY_ISSUE: "boundary-issue",
  NATURALLY_ENDED: "naturally-ended",
  UNSPECIFIED: "unspecified",
} as const;
export type EndReason = (typeof EndReason)[keyof typeof EndReason];

export interface EndResult {
  state: "ENDED";
  enderId: string;
  reason: EndReason;
  closingMessage: string | null;
}

export function endConnection(
  state: ConnectionState,
  enderId: string,
  reason: EndReason = "unspecified",
  closingMessage: string | null = null,
): EndResult {
  const next = applyConnectionAction(state, "end");
  if (next !== "ENDED") throw new Error("end: illegal state");
  if (closingMessage && closingMessage.length > 500) {
    throw new Error("end: closing message too long");
  }
  return { state: "ENDED", enderId, reason, closingMessage };
}

// PRD §29 — reconnection requires mutual interest; the ender controls it;
// the other party is never notified of a block; one message never reopens.
export const ReconnectRule = {
  ALLOW: "allow",
  TEMP_BLOCK: "temp-block",
  PERMANENT_BLOCK: "permanent-block",
} as const;
export type ReconnectRule = (typeof ReconnectRule)[keyof typeof ReconnectRule];

export function requestReconnection(
  state: ConnectionState,
  requesterIsEnder: boolean,
  rule: ReconnectRule,
  otherPartyInterested: boolean,
): { reopened: boolean; notifyOtherParty: boolean } {
  if (rule !== "allow") return { reopened: false, notifyOtherParty: false };
  void requesterIsEnder;
  const ok = canReconnect(state, otherPartyInterested, true);
  return { reopened: ok, notifyOtherParty: false };
}

// PRD §30 — private future reminder. Never notifies the other person.
export const ReminderWhen = {
  LATER: "later",
  THIS_WEEK: "this-week",
  ON_DATE: "on-date",
  CUSTOM: "custom",
} as const;
export type ReminderWhen = (typeof ReminderWhen)[keyof typeof ReminderWhen];

export function scheduleReconnectReminder(when: ReminderWhen): { when: ReminderWhen; notifiesOther: false } {
  return { when, notifiesOther: false };
}
