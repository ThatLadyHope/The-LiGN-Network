// Agreement tests: version gate, scroll math, record shape.
import { describe, expect, it } from "vitest";
import {
  AGREEMENT_TEXT,
  AGREEMENT_VERSION,
  acceptanceValid,
  buildAcceptanceRecord,
  hasReachedBottom,
  needsReaccept,
} from "../src/lib/agreement";

describe("scroll detection", () => {
  it("requires the true bottom with tolerance, never clicks or waiting", () => {
    expect(hasReachedBottom(0, 280, 1000)).toBe(false);
    expect(hasReachedBottom(500, 280, 1000)).toBe(false);
    expect(hasReachedBottom(717, 280, 1000)).toBe(false);
    expect(hasReachedBottom(720, 280, 1000)).toBe(true);
    expect(hasReachedBottom(718.5, 280, 1000)).toBe(true); // rounding tolerance
    expect(hasReachedBottom(0, 280, 200)).toBe(true); // fully visible: no scroll needed
  });
});

describe("version gate", () => {
  it("accepts only the current version", () => {
    expect(acceptanceValid(AGREEMENT_VERSION)).toBe(true);
    expect(acceptanceValid("0.9")).toBe(false);
    expect(acceptanceValid(undefined)).toBe(false);
    expect(acceptanceValid(null)).toBe(false);
    expect(acceptanceValid("")).toBe(false);
  });
  it("flags outdated or missing versions for re-acceptance", () => {
    expect(needsReaccept(AGREEMENT_VERSION)).toBe(false);
    expect(needsReaccept("0.9")).toBe(true);
    expect(needsReaccept(null)).toBe(true);
    expect(needsReaccept(undefined)).toBe(true);
  });
});

describe("acceptance record", () => {
  it("snapshots version, exact text, user, and server time", () => {
    const now = new Date("2026-10-10T12:00:00.000Z");
    const r = buildAcceptanceRecord("u1", now);
    expect(r).toEqual({
      userId: "u1",
      version: AGREEMENT_VERSION,
      textSnapshot: AGREEMENT_TEXT,
      acceptedAt: now,
      status: "accepted",
    });
    expect(AGREEMENT_TEXT).toContain("Confidentiality and Privacy");
  });
});
