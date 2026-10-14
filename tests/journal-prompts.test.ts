// Journal-prompt tests: deterministic days, full rotation, clean handoff.
import { describe, expect, it } from "vitest";
import { JOURNAL_PROMPTS, anotherPrompt, promptForDate } from "../src/lib/journal-prompts";

describe("promptForDate", () => {
  it("is deterministic for the same day", () => {
    const a = new Date(2026, 9, 14, 8, 0);
    const b = new Date(2026, 9, 14, 22, 30);
    expect(promptForDate(a)).toBe(promptForDate(b));
  });
  it("advances day to day", () => {
    const seen = new Set<string>();
    for (let d = 0; d < JOURNAL_PROMPTS.length; d++) {
      seen.add(promptForDate(new Date(2026, 0, 2 + d, 12, 0)));
    }
    expect(seen.size).toBe(JOURNAL_PROMPTS.length);
  });
  it("always returns a non-empty prompt", () => {
    for (let d = 0; d < 400; d++) {
      const p = promptForDate(new Date(2026, 0, 1 + d, 12, 0));
      expect(typeof p).toBe("string");
      expect(p.length).toBeGreaterThan(0);
    }
  });
});

describe("anotherPrompt", () => {
  it("hands a different prompt", () => {
    const first = JOURNAL_PROMPTS[0];
    expect(anotherPrompt(first)).toBe(JOURNAL_PROMPTS[1]);
    expect(anotherPrompt("not in the list")).toBe(JOURNAL_PROMPTS[0]);
  });
  it("wraps around the end", () => {
    const last = JOURNAL_PROMPTS[JOURNAL_PROMPTS.length - 1];
    expect(anotherPrompt(last)).toBe(JOURNAL_PROMPTS[0]);
  });
});
