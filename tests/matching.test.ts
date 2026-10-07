// LiGN Phase 4 tests — availability + need-first matching (PRD §12–§16).
import { describe, expect, it } from "vitest";
import {
  effectiveTemp,
  isDiscoverable,
  tempBlocksDiscovery,
  type AvailabilityInput,
} from "../src/lib/availability";
import {
  isEligible,
  noMatchFallback,
  rankCandidates,
  scoreCompatibility,
  type MatchCandidate,
  type MatchViewer,
} from "../src/lib/matching";

const NOW = new Date("2026-10-07T12:00:00.000Z");

const avail: AvailabilityInput = {
  types: ["casual-chat"],
  windows: null,
  temp: "none",
  tempUntil: null,
};

function candidate(overrides: Partial<MatchCandidate> = {}): MatchCandidate {
  return {
    id: "c1",
    needs: ["listening"],
    availabilityTypes: ["casual-chat"],
    depth: "deep",
    styles: ["listener"],
    personality: ["kind"],
    interests: ["books"],
    lifeExperience: [],
    language: "en",
    timezone: "UTC",
    location: "anywhere",
    blockedByViewer: false,
    blockedViewer: false,
    ageBlocked: false,
    safetyBlocked: false,
    discoverable: true,
    userRestricted: false,
    previouslyRejected: false,
    alreadyConnected: false,
    ...overrides,
  };
}

const viewer: MatchViewer = {
  needs: ["listening"],
  availabilityTypes: ["casual-chat"],
  depth: "deep",
  styles: ["listener"],
  personality: ["kind"],
  interests: ["books"],
  lifeExperience: [],
  language: "en",
  timezone: "UTC",
  location: "anywhere",
};

describe("availability (§15, §16)", () => {
  it("temp states expire and never end connections (discovery-only effect)", () => {
    expect(effectiveTemp({ ...avail, temp: "low-energy", tempUntil: null }, NOW)).toBe("none");
    expect(
      tempBlocksDiscovery(
        { ...avail, temp: "need-space", tempUntil: "2026-12-01T00:00:00.000Z" },
        NOW,
      ),
    ).toBe(true);
    expect(
      tempBlocksDiscovery(
        { ...avail, temp: "need-space", tempUntil: "2026-01-01T00:00:00.000Z" },
        NOW,
      ),
    ).toBe(false);
  });
  it("paused discovery and undiscoverable accounts yield nothing", () => {
    expect(isDiscoverable("paused", "DISCOVERABLE", avail, NOW)).toBe(false);
    expect(isDiscoverable("daily", "NOT_DISCOVERABLE", avail, NOW)).toBe(false);
    expect(isDiscoverable("daily", "DISCOVERABLE", avail, NOW)).toBe(true);
  });
});

describe("eligibility (§13)", () => {
  it("blocks ineligible candidates before scoring", () => {
    expect(isEligible(viewer, candidate())).toBe(true);
    expect(isEligible(viewer, candidate({ blockedByViewer: true }))).toBe(false);
    expect(isEligible(viewer, candidate({ blockedViewer: true }))).toBe(false);
    expect(isEligible(viewer, candidate({ ageBlocked: true }))).toBe(false);
    expect(isEligible(viewer, candidate({ safetyBlocked: true }))).toBe(false);
    expect(isEligible(viewer, candidate({ discoverable: false }))).toBe(false);
    expect(isEligible(viewer, candidate({ userRestricted: true }))).toBe(false);
    expect(isEligible(viewer, candidate({ previouslyRejected: true }))).toBe(false);
    expect(isEligible(viewer, candidate({ alreadyConnected: true }))).toBe(false);
  });
});

describe("compatibility (§12)", () => {
  it("current need outranks everything else", () => {
    const needMatch = candidate({ id: "need", needs: ["listening"], interests: [] });
    const interestMatch = candidate({
      id: "ints",
      needs: ["venting"],
      interests: ["books", "films", "music", "walks", "tea"],
    });
    const ranked = rankCandidates(viewer, [interestMatch, needMatch]);
    expect(ranked[0].id).toBe("need");
    expect(ranked[0].sharedNeeds).toContain("listening");
  });
  it("unavailable users never appear as available (filtered, not scored)", () => {
    const ranked = rankCandidates(viewer, [candidate({ discoverable: false })]);
    expect(ranked).toHaveLength(0);
  });
});

describe("no-match (§12)", () => {
  it("returns an honest fallback, never a fabricated human", () => {
    const ranked = rankCandidates(viewer, []);
    expect(ranked).toHaveLength(0);
    const fb = noMatchFallback();
    expect(fb.honest).toBe(true);
    expect(fb.options).toContain("listener-queue");
    expect(scoreCompatibility(viewer, candidate()).score).toBeGreaterThan(0);
  });
});
