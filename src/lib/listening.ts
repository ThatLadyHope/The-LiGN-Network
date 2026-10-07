// LiGN Phase 6 — listening + immediate need (PRD §32–§34).
// Peer support is NEVER professional care; listeners are NEVER responsible
// for another user's safety; AI NEVER appears as the human match.
export const VentMode = {
  JUST_LISTEN: "just-listen",
  ADVICE_WELCOME: "advice-welcome",
  DONT_KNOW: "dont-know",
} as const;
export type VentMode = (typeof VentMode)[keyof typeof VentMode];

// Modes may change mid-conversation — pure state swap, no side effects.
export function setVentMode(_current: VentMode, next: VentMode): VentMode {
  return next;
}

export const PEER_SUPPORT_DISCLAIMER =
  "Peer support only — not professional mental-health care. Listeners are never responsible for your safety.";

export interface ListenerSession {
  listenerId: string;
  anonymous: boolean;
  startedAt: string;
  endsAt: string;
  active: boolean;
}

export const LISTENER_SESSION_MIN = 60; // Assumption — PRD says "time-limited" with no number.

export function startListenerSession(
  listenerId: string,
  now: Date,
  minutes = LISTENER_SESSION_MIN,
): ListenerSession {
  const ends = new Date(now.getTime() + minutes * 60000);
  return {
    listenerId,
    anonymous: true,
    startedAt: now.toISOString(),
    endsAt: ends.toISOString(),
    active: true,
  };
}

// Listeners can leave at any time.
export function leaveListenerSession(session: ListenerSession): ListenerSession {
  return { ...session, active: false };
}

// PRD §34 routing order. Each step returns null when unavailable; the caller
// falls through. When everything is null the result is an honest empty state.
export const NeedSomeoneStep = {
  ONE_ON_ONE: "one-on-one-match",
  LISTENER_QUEUE: "listener-queue",
  NEED_ROOM: "need-someone-room",
  SAVED_CONNECTION: "saved-connection",
} as const;
export type NeedSomeoneStep = (typeof NeedSomeoneStep)[keyof typeof NeedSomeoneStep];

export interface NeedSomeoneResult {
  /** Never a fabricated human: null means "no human available, say so". */
  step: NeedSomeoneStep | null;
  targetId: string | null;
  honestEmpty: boolean;
}

export function routeNeedSomeone(availability: {
  oneOnOneId: string | null;
  listenerId: string | null;
  roomId: string | null;
  savedId: string | null;
}): NeedSomeoneResult {
  if (availability.oneOnOneId) {
    return { step: "one-on-one-match", targetId: availability.oneOnOneId, honestEmpty: false };
  }
  if (availability.listenerId) {
    return { step: "listener-queue", targetId: availability.listenerId, honestEmpty: false };
  }
  if (availability.roomId) {
    return { step: "need-someone-room", targetId: availability.roomId, honestEmpty: false };
  }
  // Trusted-Person shortcut is deferred (Phase 10); MVP uses saved connections only.
  if (availability.savedId) {
    return { step: "saved-connection", targetId: availability.savedId, honestEmpty: false };
  }
  return { step: null, targetId: null, honestEmpty: true };
}
