// LiGN Phase 8 — notifications without manipulation (PRD §57).
// Meaningful activity only. No streaks, guilt, urgency, or engagement bait.

export const NotificationKind = {
  CONNECTION_REQUEST: "connection-request",
  CONNECTION_ACCEPTED: "connection-accepted",
  MESSAGE: "message",
  SAFETY_EVENT: "safety-event",
  // Scheduling is Phase 10; the kind exists so prefs cover it from day one.
  SCHEDULED: "scheduled",
} as const;
export type NotificationKind = (typeof NotificationKind)[keyof typeof NotificationKind];

export interface NotificationPrefs {
  enabled: Record<NotificationKind, boolean>;
  /** 24h local hours, e.g. { start: 22, end: 7 }. Null = no quiet hours. */
  quietHours: { start: number; end: number } | null;
  paused: boolean;
}

export function defaultPrefs(): NotificationPrefs {
  return {
    enabled: {
      "connection-request": true,
      "connection-accepted": true,
      message: true,
      "safety-event": true,
      scheduled: true,
    },
    quietHours: null,
    paused: false,
  };
}

function inQuietHours(quiet: { start: number; end: number }, hour: number): boolean {
  if (quiet.start <= quiet.end) return hour >= quiet.start && hour < quiet.end;
  return hour >= quiet.start || hour < quiet.end; // overnight span
}

// Safety events bypass quiet hours and pause: a protective notice must arrive.
// Assumption — PRD lists user controls without carving safety out explicitly.
export function shouldSend(
  kind: NotificationKind,
  prefs: NotificationPrefs,
  nowHour: number,
): boolean {
  if (kind === "safety-event") return prefs.enabled[kind];
  if (prefs.paused) return false;
  if (!prefs.enabled[kind]) return false;
  if (prefs.quietHours && inQuietHours(prefs.quietHours, nowHour)) return false;
  return true;
}

// PRD §57 bans: streak reminders, guilt messages, manipulative urgency,
// artificial engagement prompts. Any template containing these fails review.
const BANNED_PATTERNS: RegExp[] = [
  /streak/i,
  /you'll lose/i,
  /\bguilt\b/i,
  /don't ignore/i,
  /last chance/i,
  /hurry/i,
  /act now/i,
  /everyone is waiting/i,
  /\d+ people (want|need) you/i,
];

export function containsBannedCopy(text: string): boolean {
  return BANNED_PATTERNS.some((p) => p.test(text));
}
