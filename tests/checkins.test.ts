// Check-in helper tests: moods, day keys, shame-free streaks.
import { describe, expect, it } from "vitest";
import {
  gentleStreak,
  isCheckinMood,
  isDayKey,
  todayKey,
} from "../src/lib/checkins";

describe("isCheckinMood", () => {
  it("accepts the three moods only", () => {
    expect(isCheckinMood("heavy")).toBe(true);
    expect(isCheckinMood("okay")).toBe(true);
    expect(isCheckinMood("light")).toBe(true);
    expect(isCheckinMood("Heavy")).toBe(false);
    expect(isCheckinMood("fine")).toBe(false);
    expect(isCheckinMood(null)).toBe(false);
  });
});

describe("isDayKey", () => {
  it("accepts YYYY-MM-DD only", () => {
    expect(isDayKey("2026-10-14")).toBe(true);
    expect(isDayKey("14-10-2026")).toBe(false);
    expect(isDayKey("2026-13-99")).toBe(false);
    expect(isDayKey("")).toBe(false);
  });
});

describe("todayKey", () => {
  it("formats local calendar days", () => {
    expect(todayKey(new Date(2026, 9, 14, 23, 59))).toBe("2026-10-14");
  });
});

describe("gentleStreak", () => {
  it("counts consecutive days ending today", () => {
    expect(
      gentleStreak(["2026-10-12", "2026-10-13", "2026-10-14"], "2026-10-14"),
    ).toBe(3);
  });
  it("tolerates missing today without zeroing", () => {
    expect(gentleStreak(["2026-10-12", "2026-10-13"], "2026-10-14")).toBe(2);
  });
  it("breaks on gaps and ignores junk", () => {
    expect(
      gentleStreak(["2026-10-14", "2026-10-10", "junk", ""], "2026-10-14"),
    ).toBe(1);
    expect(gentleStreak([], "2026-10-14")).toBe(0);
  });
  it("ignores order and duplicates", () => {
    expect(
      gentleStreak(["2026-10-13", "2026-10-14", "2026-10-13"], "2026-10-14"),
    ).toBe(2);
  });
});
