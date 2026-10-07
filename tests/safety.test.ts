// LiGN Phase 7 tests — boundaries, trust, safety, moderation, emergency.
import { describe, expect, it } from "vitest";
import {
  contactShareReminder,
  isBoundaryViolation,
  isForwardDisclosure,
  mergeBoundaries,
} from "../src/lib/boundaries";
import {
  apologyClearsRecord,
  conflictActions,
  isValidApology,
  labelTrustedPerson,
  recordFeedback,
} from "../src/lib/trust";
import {
  advanceReport,
  blockNoticeForBlockedParty,
  getHelpNow,
  ordinaryInteractionAllowed,
  reportEstablishesGuilt,
  requiresExplicitConsent,
  requiresImmediateProtection,
} from "../src/lib/safety";

describe("boundaries (§41, §42)", () => {
  it("merges global + per-connection boundaries; flags repeat post-refusal requests", () => {
    const merged = mergeBoundaries(
      { presets: ["no-number"], custom: [] },
      { presets: ["short-only"], custom: ["no voice notes"] },
    );
    expect(merged.presets).toContain("no-number");
    expect(merged.presets).toContain("short-only");
    expect(isBoundaryViolation(1)).toBe(false);
    expect(isBoundaryViolation(2)).toBe(true);
  });
  it("disclosure moves forward only; contact share shows reminder", () => {
    expect(isForwardDisclosure("nickname", "familiar")).toBe(true);
    expect(isForwardDisclosure("familiar", "nickname")).toBe(false);
    expect(contactShareReminder(true)).toMatch(/voluntary/);
    expect(contactShareReminder(false)).toBeNull();
  });
});

describe("trust (§44–§47)", () => {
  it("feedback stays private; apology valid only without forgiveness demand", () => {
    expect(recordFeedback("respectful").visibility).toBe("private");
    expect(
      isValidApology({ acknowledgesWhatHappened: true, acknowledgesHarm: true, demandsForgiveness: false }),
    ).toBe(true);
    expect(
      isValidApology({ acknowledgesWhatHappened: true, acknowledgesHarm: true, demandsForgiveness: true }),
    ).toBe(false);
    expect(apologyClearsRecord()).toBe(false);
    expect(conflictActions()).toHaveLength(5);
  });
  it("trusted label grants nothing and is not an emergency contact", () => {
    const t = labelTrustedPerson("a", "b");
    expect(t.grantsAuthority).toBe(false);
    expect(t.grantsMessageAccess).toBe(false);
    expect(t.isEmergencyContact).toBe(false);
  });
});

describe("safety (§51–§55)", () => {
  it("immediate protection for serious threats only", () => {
    expect(requiresImmediateProtection("credible-threat")).toBe(true);
    expect(requiresImmediateProtection("exploitation")).toBe(true);
    expect(requiresImmediateProtection("harassment")).toBe(false);
    expect(requiresImmediateProtection("ordinary-incompatibility")).toBe(false);
  });
  it("report flows Protect→Review→Action→Appeal; never guilt by itself", () => {
    expect(advanceReport("pending")).toBe("protecting");
    expect(advanceReport("protecting")).toBe("in-review");
    expect(advanceReport("actioned")).toBe("appealed");
    expect(() => advanceReport("closed")).toThrow(/closed/);
    expect(reportEstablishesGuilt()).toBe(false);
  });
  it("blocking stops all ordinary paths; blocked party told minimum", () => {
    expect(ordinaryInteractionAllowed({ blocked: true })).toBe(false);
    expect(ordinaryInteractionAllowed({ blocked: false })).toBe(true);
    expect(blockNoticeForBlockedParty()).toEqual({ notice: "unavailable" });
  });
  it("emergency path lists resources; listeners never responders", () => {
    const help = getHelpNow();
    expect(help.resources).toContain("emergency-services");
    expect(help.listenersAreResponders).toBe(false);
    expect(requiresExplicitConsent("recording")).toBe(true);
  });
});
