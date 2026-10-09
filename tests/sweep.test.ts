// Purge sweep tests (PRD §61).
import { describe, expect, it, vi } from "vitest";
import { isPurgeDue, purgeUserData } from "../src/lib/sweep";

describe("purge sweep", () => {
  it("is due only past the effective date", () => {
    const now = new Date("2026-11-10T00:00:00.000Z");
    expect(isPurgeDue(null, now)).toBe(false);
    expect(isPurgeDue(new Date("2026-11-11T00:00:00.000Z"), now)).toBe(false);
    expect(isPurgeDue(new Date("2026-11-09T00:00:00.000Z"), now)).toBe(true);
  });
  it("deletes owned rows before the user row, keeps shared history", async () => {
    const calls: string[] = [];
    const table = (name: string) => ({
      deleteMany: async () => {
        calls.push(name);
        return {};
      },
      delete: async () => {
        calls.push(name);
        return {};
      },
    });
    const db = {
      spaceReconnectWish: table("wishes"),
      listenerQueueEntry: table("queue"),
      deletionFeedback: table("feedback"),
      availability: table("availability"),
      block: table("block"),
      user: table("user"),
    };
    await purgeUserData(db, "u1");
    expect(calls).toEqual(["wishes", "queue", "feedback", "availability", "block", "user"]);
  });
});
