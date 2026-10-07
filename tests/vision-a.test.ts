// LiGN Phase 10 tests — voice, scheduling, quiet, activities, journal,
// memories, trusted, translation, communities.
import { describe, expect, it } from "vitest";
import { canStartVoice, leaveVoice, startVoice } from "../src/lib/voice";
import {
  cancelSchedule,
  createSchedule,
  endRecurrence,
  missedConsequence,
  pauseSchedule,
  reschedule,
} from "../src/lib/scheduling";
import {
  activitiesSecondary,
  planActivity,
  requiresConversation,
  startQuietSession,
} from "../src/lib/activities";
import {
  createJournalEntry,
  createSharedMemory,
  journalIsShareable,
  memoryVisibleTo,
  withdrawMemory,
} from "../src/lib/memories";
import {
  createCommunity,
  defaultTrustedPermissions,
  grantTrusted,
  listCommunities,
  revokeTrusted,
  translationOfferedFull,
} from "../src/lib/community";

describe("voice (§49)", () => {
  it("gated on ACTIVE + mic; leaves immediately; never auto-plays", () => {
    expect(canStartVoice("ACTIVE", true)).toBe(true);
    expect(canStartVoice("ACTIVE", false)).toBe(false);
    expect(canStartVoice("CONVERSATION", true)).toBe(false);
    const s = startVoice("live-audio");
    expect(s.autoPlay).toBe(false);
    expect(s.reportingAvailable).toBe(true);
    expect(leaveVoice(s).active).toBe(false);
  });
});

describe("scheduling (§31)", () => {
  it("reschedules, pauses, cancels, ends recurrence — missing never penalizes", () => {
    const s = createSchedule("s1", ["a", "b"], "flexible", null, "weekly");
    expect(reschedule(s, "2026-11-01T10:00:00.000Z").state).toBe("scheduled");
    expect(pauseSchedule(s).state).toBe("paused");
    expect(cancelSchedule(s).state).toBe("cancelled");
    expect(endRecurrence(s).recurrence).toBeNull();
    expect(missedConsequence()).toEqual({ penalty: 0, streakLost: false, guiltSent: false });
  });
});

describe("quiet + activities (§35, §36)", () => {
  it("quiet needs company but never conversation; activities stay secondary", () => {
    expect(() => startQuietSession(["solo"], "2026-10-08T00:00:00.000Z")).toThrow(/company/);
    expect(requiresConversation()).toBe(false);
    expect(activitiesSecondary()).toBe(true);
    expect(planActivity("walking", "activity-to-match").path).toBe("activity-to-match");
  });
});

describe("journal + memories (§58, §60)", () => {
  it("journal never shared; memories need both, withdraw hides + notifies w/o reason", () => {
    expect(journalIsShareable()).toBe(false);
    expect(createJournalEntry("j", "me", null, "A good talk.", "2026-10-07T00:00:00.000Z").ownerId).toBe("me");
    const m = createSharedMemory("m", "a", "b", "Our joke");
    const w = withdrawMemory(m, "a");
    expect(w.notifyOther).toBe(true);
    expect(w.reasonDisclosed).toBe(false);
    expect(memoryVisibleTo(w.memory, "a")).toBe(false);
    expect(memoryVisibleTo(w.memory, "b")).toBe(true);
  });
});

describe("trusted, translation, communities (§47, §56, §39)", () => {
  it("trusted: explicit perms only, revocable, never emergency", () => {
    expect(defaultTrustedPermissions()).toEqual({
      seeAvailability: false,
      seeJournal: false,
      contactOnWorry: false,
    });
    const t = grantTrusted("me", "you", { ...defaultTrustedPermissions(), seeAvailability: true });
    expect(t.isEmergencyContact).toBe(false);
    expect(revokeTrusted(t).permissions.seeAvailability).toBe(false);
    expect(translationOfferedFull(false)).toBe(false);
  });
  it("communities stay 3–8 and unordered", () => {
    expect(() => createCommunity("c", "Book club", "Oslo", ["a", "b"])).toThrow(/3–8/);
    const list = [createCommunity("c1", "A", "Oslo", ["a", "b", "c"])];
    expect(listCommunities(list)).toEqual(list);
  });
});
