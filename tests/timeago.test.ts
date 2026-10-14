// timeAgo tests: freshness stamps for the notification bell.
import { describe, expect, it } from "vitest";
import { timeAgo } from "../src/lib/messaging";

describe("timeAgo", () => {
  const now = new Date("2026-10-14T12:00:00Z");
  it("says just now under a minute", () => {
    expect(timeAgo("2026-10-14T11:59:30Z", now)).toBe("just now");
    expect(timeAgo("2026-10-14T12:00:00Z", now)).toBe("just now");
  });
  it("counts minutes, hours, days", () => {
    expect(timeAgo("2026-10-14T11:55:00Z", now)).toBe("5m ago");
    expect(timeAgo("2026-10-14T09:00:00Z", now)).toBe("3h ago");
    expect(timeAgo("2026-10-12T12:00:00Z", now)).toBe("2d ago");
  });
  it("never goes negative", () => {
    expect(timeAgo("2026-10-14T13:00:00Z", now)).toBe("just now");
  });
});
