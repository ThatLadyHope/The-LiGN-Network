// Arrival check-in helpers: moods, day keys, gentle-day streaks.
// A streak counts consecutive calendar days with a check-in — presence,
// never performance. Breaks are not punished anywhere.
export const CHECKIN_MOODS = ["heavy", "okay", "light"] as const;
export type CheckinMood = (typeof CHECKIN_MOODS)[number];

export const MOOD_LABELS: Record<CheckinMood, string> = {
  heavy: "Heavy",
  okay: "Okay",
  light: "Light",
};

export function isCheckinMood(value: unknown): value is CheckinMood {
  return (
    typeof value === "string" &&
    (CHECKIN_MOODS as readonly string[]).includes(value)
  );
}

export function isDayKey(value: unknown): value is string {
  return (
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime())
  );
}

/** Local calendar day key, YYYY-MM-DD. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftKey(key: string, deltaDays: number): string {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return `${d.getUTCFullYear()}-${`${d.getUTCMonth() + 1}`.padStart(2, "0")}-${`${d.getUTCDate()}`.padStart(2, "0")}`;
}

/**
 * Consecutive-day streak ending today (or yesterday, so missing only today
 * doesn't zero a live streak). `days` are YYYY-MM-DD keys, any order.
 */
export function gentleStreak(days: string[], today: string = todayKey()): number {
  const set = new Set(days.filter(isDayKey));
  let cursor = set.has(today) ? today : shiftKey(today, -1);
  if (!set.has(cursor)) return 0;
  let n = 0;
  while (set.has(cursor)) {
    n += 1;
    cursor = shiftKey(cursor, -1);
  }
  return n;
}
