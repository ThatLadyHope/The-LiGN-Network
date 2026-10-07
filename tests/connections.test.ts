// LiGN Phase 5 tests — requests, lifecycle, silence, ending, reconnection (PRD §22–§30).
import { describe, expect, it } from "vitest";
import {
  acceptedNextActions,
  applyConnectionAction,
  endConnection,
  isRepeatedUnwanted,
  nudgeEligible,
  oneSidedOffers,
  requestReconnection,
  respondToRequest,
  scheduleReconnectReminder,
  validateRequest,
} from "../src/lib/connections";
import { MessageContent, freshStarter } from "../src/lib/messaging";

describe("requests (§22)", () => {
  it("requires mutual interest: accept advances, decline/ignore reset", () => {
    expect(respondToRequest("CONVERSATION", "accepted")).toBe("MUTUAL_CONNECTION");
    expect(respondToRequest("CONVERSATION", "declined")).toBe("STRANGER");
    expect(respondToRequest("CONVERSATION", "ignored")).toBe("STRANGER");
  });
  it("rejects self-requests and flags repeated unwanted requests", () => {
    expect(() => validateRequest({ senderId: "a", recipientId: "a", reason: null, note: null }))
      .toThrow(/yourself/);
    expect(isRepeatedUnwanted(2)).toBe(false);
    expect(isRepeatedUnwanted(3)).toBe(true);
  });
});

describe("lifecycle actions (§24, §25)", () => {
  it("continues, pauses, archives, ends in legal order", () => {
    expect(applyConnectionAction("MUTUAL_CONNECTION", "continue")).toBe("ACTIVE");
    expect(applyConnectionAction("ACTIVE", "pause")).toBe("PAUSED");
    expect(applyConnectionAction("PAUSED", "continue")).toBe("ACTIVE");
    expect(applyConnectionAction("PAUSED", "archive")).toBe("ARCHIVED");
    expect(applyConnectionAction("ACTIVE", "end")).toBe("ENDED");
  });
  it("accepted screen offers actions but triggers nothing automatically", () => {
    expect(acceptedNextActions()).toHaveLength(3);
  });
});

describe("silence + one-sided (§26, §27)", () => {
  it("nudges only after meaningful inactivity with cooldown", () => {
    const now = new Date("2026-10-07T12:00:00.000Z");
    expect(nudgeEligible(new Date("2026-10-06T12:00:00.000Z"), null, now)).toBe(false);
    expect(nudgeEligible(new Date("2026-09-20T12:00:00.000Z"), null, now)).toBe(true);
    expect(
      nudgeEligible(new Date("2026-09-20T12:00:00.000Z"), new Date("2026-10-01T12:00:00.000Z"), now),
    ).toBe(false);
  });
  it("one-sided offers carry no blame or status", () => {
    expect(oneSidedOffers()).toHaveLength(4);
  });
});

describe("ending + reconnection (§28–§30)", () => {
  it("ends without explanation; simultaneous end stays ENDED", () => {
    const r = endConnection("ACTIVE", "a");
    expect(r.state).toBe("ENDED");
    expect(r.reason).toBe("unspecified");
    expect(endConnection("PAUSED", "b", "need-space", "Take care.").closingMessage).toBe("Take care.");
  });
  it("never auto-reopens; ender controls; nobody notified of blocks", () => {
    expect(requestReconnection("ENDED", false, "allow", false).reopened).toBe(false);
    expect(requestReconnection("ENDED", false, "allow", true).reopened).toBe(true);
    expect(requestReconnection("ENDED", false, "temp-block", true)).toEqual({
      reopened: false,
      notifyOtherParty: false,
    });
    expect(requestReconnection("ENDED", false, "permanent-block", true).notifyOtherParty).toBe(false);
  });
  it("future reminders are private", () => {
    expect(scheduleReconnectReminder("this-week")).toEqual({
      when: "this-week",
      notifiesOther: false,
    });
  });
});

describe("messaging (§19–§21)", () => {
  it("accepts text 1–2000 chars; starters are optional samples", () => {
    expect(MessageContent.safeParse({ text: "Hi" }).success).toBe(true);
    expect(MessageContent.safeParse({ text: "" }).success).toBe(false);
    expect(freshStarter([]).length).toBeGreaterThan(0);
  });
});
