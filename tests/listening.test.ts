// LiGN Phase 6 tests — listening, need-someone routing, temp spaces (PRD §32–§40).
import { describe, expect, it } from "vitest";
import {
  leaveListenerSession,
  routeNeedSomeone,
  setVentMode,
  startListenerSession,
} from "../src/lib/listening";
import {
  MAX_PARTICIPANTS,
  closeEarly,
  creatorLeave,
  expireSpace,
  isExpired,
  joinSpace,
  postSpaceReconnect,
  reportAllowedAfterClosure,
  validateSpace,
  type SpaceSnapshot,
} from "../src/lib/spaces";

const NOW = new Date("2026-10-07T12:00:00.000Z");

function space(overrides: Partial<SpaceSnapshot> = {}): SpaceSnapshot {
  return {
    state: "open",
    creatorId: "creator",
    participants: [{ userId: "creator", joinedAt: "2026-10-07T11:00:00.000Z" }],
    closesAt: "2026-10-07T13:00:00.000Z",
    ...overrides,
  };
}

describe("vent modes (§32)", () => {
  it("modes change mid-conversation", () => {
    expect(setVentMode("just-listen", "advice-welcome")).toBe("advice-welcome");
    expect(setVentMode("advice-welcome", "dont-know")).toBe("dont-know");
  });
});

describe("listener mode (§33)", () => {
  it("sessions are time-limited and leavable at any time", () => {
    const s = startListenerSession("l1", NOW, 60);
    expect(s.anonymous).toBe(true);
    expect(s.active).toBe(true);
    expect(leaveListenerSession(s).active).toBe(false);
  });
});

describe("need-someone routing (§34)", () => {
  it("follows 1-on-1 → queue → room → saved, honest when empty", () => {
    expect(
      routeNeedSomeone({ oneOnOneId: "u", listenerId: "l", roomId: "r", savedId: "s" }).step,
    ).toBe("one-on-one-match");
    expect(
      routeNeedSomeone({ oneOnOneId: null, listenerId: "l", roomId: "r", savedId: "s" }).step,
    ).toBe("listener-queue");
    expect(
      routeNeedSomeone({ oneOnOneId: null, listenerId: null, roomId: "r", savedId: "s" }).step,
    ).toBe("need-someone-room");
    const empty = routeNeedSomeone({
      oneOnOneId: null,
      listenerId: null,
      roomId: null,
      savedId: null,
    });
    expect(empty.honestEmpty).toBe(true);
    expect(empty.targetId).toBeNull();
  });
});

describe("spaces (§37)", () => {
  it("enforces 3–8 capacity and duration limits", () => {
    expect(() =>
      validateSpace({ creatorId: "c", purpose: "chat", durationMin: 30, capacity: 2 }),
    ).toThrow(/3–8/);
    expect(() =>
      validateSpace({ creatorId: "c", purpose: "chat", durationMin: 30, capacity: 9 }),
    ).toThrow(/3–8/);
    expect(() =>
      validateSpace({ creatorId: "c", purpose: "", durationMin: 30, capacity: 5 }),
    ).toThrow(/purpose/);
    expect(() =>
      validateSpace({ creatorId: "c", purpose: "chat", durationMin: 500, capacity: 5 }),
    ).toThrow(/limits/);
  });
  it("expiry closes; closed spaces refuse joins", () => {
    const s = space();
    expect(isExpired(s, NOW)).toBe(false);
    expect(isExpired(s, new Date("2026-10-07T14:00:00.000Z"))).toBe(true);
    expect(expireSpace(s, new Date("2026-10-07T14:00:00.000Z")).state).toBe("expired");
    expect(() => joinSpace({ ...s, state: "closed" }, "x", NOW)).toThrow(/closed/);
  });
  it("caps participants and transfers ownership on creator leave", () => {
    let s = space();
    for (let i = 0; i < MAX_PARTICIPANTS - 1; i++) {
      s = joinSpace(s, `u${i}`, NOW);
    }
    expect(s.participants).toHaveLength(MAX_PARTICIPANTS);
    expect(() => joinSpace(s, "extra", NOW)).toThrow(/capacity/);
    const after = creatorLeave(s, NOW);
    expect(after.creatorId).not.toBe("creator");
    expect(after.state).toBe("open");
    expect(creatorLeave(space({ participants: [] }), NOW).state).toBe("closed");
  });
  it("creator ends early; reports allowed in window after closure", () => {
    expect(closeEarly(space(), "creator").state).toBe("closed");
    expect(() => closeEarly(space(), "intruder")).toThrow(/only creator/);
    expect(reportAllowedAfterClosure(new Date("2026-10-01T00:00:00.000Z"), NOW)).toBe(true);
    expect(reportAllowedAfterClosure(new Date("2026-08-01T00:00:00.000Z"), NOW)).toBe(false);
  });
});

describe("post-space reconnection (§38)", () => {
  it("connects only on mutual interest; unilateral stays hidden", () => {
    expect(postSpaceReconnect(true, true)).toEqual({ connected: true, disclosed: true });
    expect(postSpaceReconnect(true, false)).toEqual({ connected: false, disclosed: false });
  });
});
