// LiGN Phase 9 — final acceptance: North Star + no-guilt copy across UI.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { containsBannedCopy } from "../src/lib/notifications";
import { countsAsContinuation, isMeaningfulMutualConnection } from "../src/lib/metrics";

describe("north star (§71)", () => {
  it("counts only voluntary, real, continuing connections", () => {
    expect(
      isMeaningfulMutualConnection({
        bothChoseToContinue: true,
        hadActualInteraction: true,
        immediatelyEnded: false,
        stillVoluntary: true,
      }),
    ).toBe(true);
    expect(
      isMeaningfulMutualConnection({
        bothChoseToContinue: true,
        hadActualInteraction: true,
        immediatelyEnded: true,
        stillVoluntary: true,
      }),
    ).toBe(false);
    expect(
      isMeaningfulMutualConnection({
        bothChoseToContinue: true,
        hadActualInteraction: false,
        immediatelyEnded: false,
        stillVoluntary: true,
      }),
    ).toBe(false);
    expect(countsAsContinuation({ continuedBeyondFirst: true, voluntary: false })).toBe(false);
  });
});

describe("copy review (§76, Final Product Test)", () => {
  it("ships no guilt/urgency/engagement copy in UI files", () => {
    for (const f of ["app.html", "design.html"]) {
      const text = readFileSync(process.cwd() + "/" + f, "utf8");
      expect(containsBannedCopy(text), f).toBe(false);
    }
  });
});
