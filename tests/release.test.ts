// LiGN Phase 12 tests — monetization guardrails (PRD §72).
import { describe, expect, it } from "vitest";
import { isAllowedRevenue, isBannedRevenue, paywallsConnection } from "../src/lib/monetization";

describe("monetization (§72)", () => {
  it("allows only subscriptions, premium tools, ethical partnerships", () => {
    expect(isAllowedRevenue("optional-subscriptions")).toBe(true);
    expect(isAllowedRevenue("optional-premium-tools")).toBe(true);
    expect(isAllowedRevenue("popularity")).toBe(false);
  });
  it("bans monetizing loneliness, attention, access, being heard, emergency", () => {
    for (const b of [
      "loneliness",
      "attention",
      "popularity",
      "basic-access-to-connection",
      "being-heard",
      "emergency-access",
    ]) {
      expect(isBannedRevenue(b)).toBe(true);
    }
    expect(paywallsConnection()).toBe(false);
  });
});
