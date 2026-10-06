// LiGN Phase 2 — foundation tests (run with vitest after npm install).
import { describe, expect, it } from "vitest";
import { canReconnect, canTransition } from "../src/lib/transitions";
import { discoveryLeakCheck, isDeniedByPrecedence } from "../src/lib/privacy";

describe("transitions (§64)", () => {
  it("allows STRANGER→CONVERSATION→MUTUAL_CONNECTION→ACTIVE", () => {
    expect(canTransition("STRANGER", "CONVERSATION")).toBe(true);
    expect(canTransition("CONVERSATION", "MUTUAL_CONNECTION")).toBe(true);
    expect(canTransition("MUTUAL_CONNECTION", "ACTIVE")).toBe(true);
  });
  it("rejects illegal jumps and never auto-reopens", () => {
    expect(canTransition("STRANGER", "ACTIVE")).toBe(false);
    expect(canTransition("ENDED", "ACTIVE")).toBe(false);
    expect(canReconnect("ENDED", false, true)).toBe(false);
    expect(canReconnect("ENDED", true, false)).toBe(false);
    expect(canReconnect("ENDED", true, true)).toBe(true);
  });
});

describe("privacy (§65)", () => {
  it("blocks verification/journal/safety/private from discovery", () => {
    expect(discoveryLeakCheck("verification")).toBe(true);
    expect(discoveryLeakCheck("journal")).toBe(true);
    expect(discoveryLeakCheck("safety")).toBe(true);
    expect(discoveryLeakCheck("public")).toBe(false);
  });
  it("higher-priority denial wins", () => {
    expect(
      isDeniedByPrecedence([
        { layer: "public", denied: false },
        { layer: "safety", denied: true },
      ]),
    ).toBe(true);
  });
});
