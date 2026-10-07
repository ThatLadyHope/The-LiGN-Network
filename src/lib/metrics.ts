// LiGN Phase 9 — North Star instrumentation only (PRD §70, §71).
// Meaningful mutual connections. No engagement metrics exist by design:
// nothing here counts screen time, volume, streaks, or retention pressure,
// so the metric can never be increased by making it harder to leave.

export interface ConnectionOutcome {
  bothChoseToContinue: boolean;
  hadActualInteraction: boolean;
  immediatelyEnded: boolean;
  stillVoluntary: boolean;
}

// All four must hold (§71). Leaving freely can never reduce this count
// punitively — it simply is not a meaningful mutual connection.
export function isMeaningfulMutualConnection(o: ConnectionOutcome): boolean {
  return (
    o.bothChoseToContinue && o.hadActualInteraction && !o.immediatelyEnded && o.stillVoluntary
  );
}

export interface VoluntaryContinuation {
  continuedBeyondFirst: boolean;
  voluntary: boolean;
}

export function countsAsContinuation(v: VoluntaryContinuation): boolean {
  return v.continuedBeyondFirst && v.voluntary;
}
