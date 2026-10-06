// LiGN Phase 2 — §64 transition guards. Never auto-reopen on a single message.
import type { ConnectionState } from "./states";

const ALLOWED: Record<ConnectionState, ConnectionState[]> = {
  STRANGER: ["CONVERSATION"],
  CONVERSATION: ["MUTUAL_CONNECTION"],
  MUTUAL_CONNECTION: ["ACTIVE"],
  ACTIVE: ["PAUSED", "ENDED"],
  PAUSED: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: [],
  ENDED: [],
};

export function canTransition(from: ConnectionState, to: ConnectionState): boolean {
  return ALLOWED[from].includes(to);
}

// Reconnection is a new mutual interaction, never a single message after end.
export function canReconnect(
  state: ConnectionState,
  mutualInterest: boolean,
  reconnectAllowed: boolean,
): boolean {
  if (state !== "ARCHIVED" && state !== "ENDED") return false;
  return mutualInterest && reconnectAllowed;
}
