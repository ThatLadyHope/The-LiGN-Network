// LiGN Phase 2 — §63 canonical states. Single source of truth. Independent axes.
export const AccountState = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  DELETED: "DELETED",
} as const;
export type AccountState = (typeof AccountState)[keyof typeof AccountState];

export const DiscoveryState = {
  DISCOVERABLE: "DISCOVERABLE",
  NOT_DISCOVERABLE: "NOT_DISCOVERABLE",
} as const;
export type DiscoveryState = (typeof DiscoveryState)[keyof typeof DiscoveryState];

export const ConnectionState = {
  STRANGER: "STRANGER",
  CONVERSATION: "CONVERSATION",
  MUTUAL_CONNECTION: "MUTUAL_CONNECTION",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  ARCHIVED: "ARCHIVED",
  ENDED: "ENDED",
} as const;
export type ConnectionState = (typeof ConnectionState)[keyof typeof ConnectionState];

export const SafetyState = {
  NORMAL: "NORMAL",
  FLAGGED: "FLAGGED",
  RESTRICTED: "RESTRICTED",
  SUSPENDED: "SUSPENDED",
  REMOVED: "REMOVED",
} as const;
export type SafetyState = (typeof SafetyState)[keyof typeof SafetyState];
