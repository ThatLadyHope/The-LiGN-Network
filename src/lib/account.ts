// LiGN Phase 3 — account lifecycle logic (PRD §5, §17, §18, §61).
// Pure functions over plain data: no DB imports, unit-testable without Postgres.
import type { AccountState, DiscoveryState } from "./states";

export interface AccountSnapshot {
  accountState: AccountState;
  discoveryState: DiscoveryState;
  /** Set while a return period is pending (PRD §18). */
  returnAt: string | null;
  /** Set while a deletion cooling-off period is pending (PRD §61). */
  pendingDeletionAt: string | null;
}

export const COOLING_OFF_DAYS = 14; // Assumption — PRD gives no number (§61).

// PRD §5 — one account, one identity. The data layer must reject a second identity.
export function assertSingleIdentity(existingCount: number): void {
  if (existingCount > 0) {
    throw new Error("one-identity: this account already has a LiGN identity");
  }
}

// PRD §18 — pause: leave discovery, block new requests, preserve connections/data. Reversible.
export function pauseAccount(
  account: AccountSnapshot,
  returnAt: string | null,
): AccountSnapshot {
  if (account.accountState === "DELETED") {
    throw new Error("pause: deleted accounts cannot be paused");
  }
  return { ...account, accountState: "PAUSED", discoveryState: "NOT_DISCOVERABLE", returnAt };
}

export function resumeAccount(account: AccountSnapshot): AccountSnapshot {
  if (account.accountState !== "PAUSED") {
    throw new Error("resume: account is not paused");
  }
  return { ...account, accountState: "ACTIVE", returnAt: null };
}

// PRD §61 — deletion must explain consequences before confirmation.
export function deletionConsequences(): string[] {
  return [
    "account",
    "personal-information",
    "connections",
    "messages",
    "journal",
    "memories",
    "uploaded-media",
    "verification-information",
  ];
}

export interface DeletionRequest {
  requestedAt: string;
  /** Irreversible deletion happens no earlier than this (cooling-off). */
  effectiveAt: string;
}

// Cooling-off: account rests PAUSED + undiscoverable; safety retention still applies.
export function requestDeletion(now: Date, coolingDays = COOLING_OFF_DAYS): DeletionRequest {
  const effective = new Date(now.getTime() + coolingDays * 24 * 60 * 60 * 1000);
  return { requestedAt: now.toISOString(), effectiveAt: effective.toISOString() };
}

export function deletionIsEffective(now: Date, request: DeletionRequest): boolean {
  return now.getTime() >= new Date(request.effectiveAt).getTime();
}

// PRD §61 — deletion never bypasses active safety controls or legal retention.
export function deletionBlockedBySafety(activeSafetyHold: boolean): boolean {
  return activeSafetyHold;
}
