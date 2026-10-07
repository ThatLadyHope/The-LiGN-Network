// LiGN Phase 3 tests — account, onboarding, profile (PRD §5, §6, §8, §9, §18, §61, §75).
import { describe, expect, it } from "vitest";
import {
  assertSingleIdentity,
  deletionBlockedBySafety,
  deletionConsequences,
  deletionIsEffective,
  pauseAccount,
  requestDeletion,
  resumeAccount,
  type AccountSnapshot,
} from "../src/lib/account";
import { OnboardingMinimal, ProfileUpdate, passesAgeSafety } from "../src/lib/profile";

const active: AccountSnapshot = {
  accountState: "ACTIVE",
  discoveryState: "DISCOVERABLE",
  returnAt: null,
  pendingDeletionAt: null,
};

describe("one identity (§5)", () => {
  it("rejects a second identity on the same account", () => {
    expect(() => assertSingleIdentity(0)).not.toThrow();
    expect(() => assertSingleIdentity(1)).toThrow(/one-identity/);
  });
});

describe("onboarding minimal (§75)", () => {
  it("accepts nickname + age-safety + need + language", () => {
    const r = OnboardingMinimal.safeParse({
      nickname: "Wren",
      ageRange: "25-34",
      currentNeeds: ["listening"],
      language: "en",
    });
    expect(r.success).toBe(true);
  });
  it("rejects empty needs and overlong nicknames", () => {
    expect(
      OnboardingMinimal.safeParse({
        nickname: "Wren",
        ageRange: "25-34",
        currentNeeds: [],
        language: "en",
      }).success,
    ).toBe(false);
    expect(
      OnboardingMinimal.safeParse({
        nickname: "x".repeat(31),
        ageRange: "25-34",
        currentNeeds: ["venting"],
        language: "en",
      }).success,
    ).toBe(false);
  });
});

describe("age safety (§8)", () => {
  it("blocks under-18 from adult matching", () => {
    expect(passesAgeSafety("under-18")).toBe(false);
    expect(passesAgeSafety("18-24")).toBe(true);
  });
});

describe("profile (§6, §9)", () => {
  it("accepts progressive updates and coarse location only", () => {
    const r = ProfileUpdate.safeParse({
      bio: "Quiet reader.",
      locationPreference: "nearby",
      romanticBoundary: "friends-only",
    });
    expect(r.success).toBe(true);
  });
});

describe("pause (§18)", () => {
  it("removes from discovery, preserves state otherwise, restores cleanly", () => {
    const paused = pauseAccount(active, "2026-11-01T00:00:00.000Z");
    expect(paused.accountState).toBe("PAUSED");
    expect(paused.discoveryState).toBe("NOT_DISCOVERABLE");
    const resumed = resumeAccount(paused);
    expect(resumed.accountState).toBe("ACTIVE");
    expect(resumed.returnAt).toBeNull();
  });
  it("refuses to pause a deleted account", () => {
    expect(() =>
      pauseAccount({ ...active, accountState: "DELETED" }, null),
    ).toThrow(/deleted/);
  });
});

describe("deletion (§61)", () => {
  it("lists all 8 consequence categories", () => {
    expect(deletionConsequences()).toHaveLength(8);
  });
  it("enforces cooling-off and never bypasses safety holds", () => {
    const req = requestDeletion(new Date("2026-10-07T00:00:00.000Z"), 14);
    expect(deletionIsEffective(new Date("2026-10-07T00:00:00.000Z"), req)).toBe(false);
    expect(deletionIsEffective(new Date("2026-10-22T00:00:00.000Z"), req)).toBe(true);
    expect(deletionBlockedBySafety(true)).toBe(true);
    expect(deletionBlockedBySafety(false)).toBe(false);
  });
});
