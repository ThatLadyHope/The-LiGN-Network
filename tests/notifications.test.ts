// LiGN Phase 8 tests — notifications, private search, language (PRD §56, §57, §59).
import { describe, expect, it } from "vitest";
import {
  containsBannedCopy,
  defaultPrefs,
  shouldSend,
} from "../src/lib/notifications";
import { culturalBoost, searchOwnHistory, translationOffered } from "../src/lib/search";

describe("notifications (§57)", () => {
  it("sends meaningful activity; quiet hours suppress non-safety", () => {
    const prefs = { ...defaultPrefs(), quietHours: { start: 22, end: 7 } };
    expect(shouldSend("message", prefs, 23)).toBe(false);
    expect(shouldSend("message", prefs, 12)).toBe(true);
  });
  it("global pause stops everything except safety events", () => {
    const prefs = { ...defaultPrefs(), paused: true };
    expect(shouldSend("message", prefs, 12)).toBe(false);
    expect(shouldSend("connection-request", prefs, 12)).toBe(false);
    expect(shouldSend("safety-event", prefs, 3)).toBe(true);
  });
  it("category toggles respected", () => {
    const prefs = { ...defaultPrefs(), enabled: { ...defaultPrefs().enabled, message: false } };
    expect(shouldSend("message", prefs, 12)).toBe(false);
    expect(shouldSend("connection-accepted", prefs, 12)).toBe(true);
  });
  it("bans streak/guilt/urgency/engagement copy", () => {
    expect(containsBannedCopy("Don't lose your streak!")).toBe(true);
    expect(containsBannedCopy("Hurry, last chance, act now!")).toBe(true);
    expect(containsBannedCopy("No rush — reply whenever feels right.")).toBe(false);
    expect(containsBannedCopy("Maya accepted your connection request.")).toBe(false);
  });
});

describe("private search (§59)", () => {
  const records = [
    { ownerId: "me", nickname: "Wren", interests: ["books"], topics: ["grief"] },
    { ownerId: "other", nickname: "Wren", interests: ["books"], topics: ["grief"] },
  ];
  it("searches only the owner's history; no public directory path", () => {
    expect(searchOwnHistory("me", records, "wren")).toHaveLength(1);
    expect(searchOwnHistory("me", records, "books")).toHaveLength(1);
    expect(searchOwnHistory("me", records, "")).toHaveLength(0);
    expect(searchOwnHistory("nobody", records, "wren")).toHaveLength(0);
  });
});

describe("language stub (§56)", () => {
  it("stores prefs; no translation engine; no cultural boost", () => {
    expect(translationOffered()).toBe(false);
    expect(culturalBoost()).toBe(0);
  });
});
