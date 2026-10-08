// LiGN Phase 11 tests — video, recording, advanced depth.
import { describe, expect, it } from "vitest";
import {
  canStartVideo,
  leaveVideo,
  recordingConsented,
  safetyRecordingRetained,
  startVideo,
} from "../src/lib/video";
import {
  RECENCY_BONUS_MAX,
  recordTrustNote,
  refinedScore,
  resolveLocale,
  templateCapacity,
} from "../src/lib/advanced";
import type { MatchCandidate, MatchViewer } from "../src/lib/matching";

const viewer: MatchViewer = {
  needs: ["listening"],
  availabilityTypes: [],
  depth: null,
  styles: [],
  personality: [],
  interests: [],
  lifeExperience: [],
  language: null,
  timezone: null,
  location: null,
};

function candidate(needs: MatchCandidate["needs"]): MatchCandidate {
  return {
    id: "c",
    needs,
    availabilityTypes: [],
    depth: null,
    styles: [],
    personality: [],
    interests: [],
    lifeExperience: [],
    language: null,
    timezone: null,
    location: null,
    blockedByViewer: false,
    blockedViewer: false,
    ageBlocked: false,
    safetyBlocked: false,
    discoverable: true,
    userRestricted: false,
    previouslyRejected: false,
    alreadyConnected: false,
  };
}

describe("video + recording (§49, §50)", () => {
  it("video needs ACTIVE + mic + camera; never auto-activates; leaves fast", () => {
    expect(canStartVideo("ACTIVE", { mic: true, camera: true })).toBe(true);
    expect(canStartVideo("ACTIVE", { mic: true, camera: false })).toBe(false);
    expect(canStartVideo("CONVERSATION", { mic: true, camera: true })).toBe(false);
    const s = startVideo();
    expect(s.autoActivated).toBe(false);
    expect(s.reportingAvailable).toBe(true);
    expect(leaveVideo(s).active).toBe(false);
  });
  it("recording needs every consent; safety retention limited + gated", () => {
    expect(recordingConsented([true, true])).toBe(true);
    expect(recordingConsented([true, false])).toBe(false);
    expect(recordingConsented([])).toBe(false);
    expect(safetyRecordingRetained(10, "moderator")).toBe(true);
    expect(safetyRecordingRetained(10, "other-user")).toBe(false);
    expect(safetyRecordingRetained(60, "moderator")).toBe(false);
  });
});

describe("advanced depth (Later Phase 3)", () => {
  it("templates stay 3–8; trust stays private", () => {
    expect(templateCapacity()).toEqual({ min: 3, max: 8 });
    expect(recordTrustNote("a", "b", "kind").visibility).toBe("private");
  });
  it("locale falls back gracefully; need still dominates refined scoring", () => {
    expect(resolveLocale("en", ["fr"], ["fr", "en"])).toBe("en");
    expect(resolveLocale("de", ["fr"], ["fr", "en"])).toBe("fr");
    // listening viewer: a venting talker (100) beats a stale non-match even
    // with maxed recency bonus (capped 50) — need still dominates.
    const talker = refinedScore(viewer, candidate(["venting"]), 0);
    const staleRich = refinedScore(
      viewer,
      candidate(["casual-chat"]),
      RECENCY_BONUS_MAX * 10,
    );
    expect(talker.refined).toBeGreaterThan(staleRich.refined);
  });
});
