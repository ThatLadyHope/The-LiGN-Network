// LiGN Phase 10 — scheduling + recurring conversations (PRD §31).
// Missed conversations NEVER create penalties, scores, streak loss, or guilt.

export const ScheduleWhen = {
  EXACT: "exact",
  FLEXIBLE: "flexible",
} as const;
export type ScheduleWhen = (typeof ScheduleWhen)[keyof typeof ScheduleWhen];

export const ScheduleState = {
  SCHEDULED: "scheduled",
  PAUSED: "paused",
  CANCELLED: "cancelled",
  ENDED: "ended",
} as const;
export type ScheduleState = (typeof ScheduleState)[keyof typeof ScheduleState];

export interface Schedule {
  id: string;
  participantIds: string[];
  when: ScheduleWhen;
  at: string | null;
  recurrence: string | null;
  state: ScheduleState;
}

export function createSchedule(
  id: string,
  participantIds: string[],
  when: ScheduleWhen,
  at: string | null,
  recurrence: string | null = null,
): Schedule {
  if (participantIds.length < 2) throw new Error("schedule: needs participants");
  return { id, participantIds, when, at, recurrence, state: "scheduled" };
}

export function reschedule(s: Schedule, at: string | null): Schedule {
  if (s.state !== "scheduled" && s.state !== "paused") throw new Error("schedule: cannot move");
  return { ...s, at, state: "scheduled" };
}

export function pauseSchedule(s: Schedule): Schedule {
  if (s.state !== "scheduled") throw new Error("schedule: not scheduled");
  return { ...s, state: "paused" };
}

export function cancelSchedule(s: Schedule): Schedule {
  return { ...s, state: "cancelled" };
}

export function endRecurrence(s: Schedule): Schedule {
  return { ...s, recurrence: null, state: "ended" };
}

// Invariant: missing a conversation has zero consequences.
export function missedConsequence(): { penalty: 0; streakLost: false; guiltSent: false } {
  return { penalty: 0, streakLost: false, guiltSent: false };
}
