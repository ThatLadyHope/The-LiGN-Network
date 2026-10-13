// Messaging-helper tests: honest ticks and day dividers.
import { describe, expect, it } from "vitest";
import { dayLabel, messageTick, timeLabel } from "../src/lib/messaging";

describe("messageTick", () => {
  it("is sent when the other side never opened the thread", () => {
    expect(messageTick("2026-10-13T10:00:00Z", null)).toBe("sent");
    expect(messageTick("2026-10-13T10:00:00Z", undefined)).toBe("sent");
  });
  it("is seen when they opened at/after the message", () => {
    expect(messageTick("2026-10-13T10:00:00Z", "2026-10-13T10:00:00Z")).toBe("seen");
    expect(messageTick("2026-10-13T10:00:00Z", "2026-10-13T10:05:00Z")).toBe("seen");
  });
  it("stays sent when they opened before the message", () => {
    expect(messageTick("2026-10-13T10:05:00Z", "2026-10-13T10:00:00Z")).toBe("sent");
  });
});

describe("dayLabel", () => {
  // Local-time construction: the helper compares calendar days in the
  // viewer's timezone, so the fixtures must be local too.
  const now = new Date(2026, 9, 13, 15, 35);
  it("labels today and yesterday", () => {
    expect(dayLabel(new Date(2026, 9, 13, 8, 0), now)).toBe("Today");
    expect(dayLabel(new Date(2026, 9, 12, 23, 0), now)).toBe("Yesterday");
  });
  it("names older days", () => {
    expect(dayLabel(new Date(2026, 9, 5, 8, 0), now)).toMatch(/Monday|October|5/);
  });
});

describe("timeLabel", () => {
  it("returns a short time", () => {
    expect(timeLabel("2026-10-13T15:35:00Z")).toMatch(/\d{1,2}:\d{2}/);
  });
});
