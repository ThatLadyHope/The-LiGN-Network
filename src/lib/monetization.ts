// LiGN Phase 12 — monetization guardrails (PRD §72).
// Core human connection remains free. Users never pay to find someone to talk to.

export const AllowedRevenue = {
  SUBSCRIPTIONS: "optional-subscriptions",
  PREMIUM_TOOLS: "optional-premium-tools",
  ETHICAL_PARTNERSHIPS: "ethical-partnerships",
} as const;
export type AllowedRevenue = (typeof AllowedRevenue)[keyof typeof AllowedRevenue];

// What LiGN must NEVER monetize (§72).
export const BannedRevenue = {
  LONELINESS: "loneliness",
  ATTENTION: "attention",
  POPULARITY: "popularity",
  BASIC_ACCESS: "basic-access-to-connection",
  BEING_HEARD: "being-heard",
  EMERGENCY: "emergency-access",
} as const;
export type BannedRevenue = (typeof BannedRevenue)[keyof typeof BannedRevenue];

export function isAllowedRevenue(source: string): boolean {
  return (Object.values(AllowedRevenue) as string[]).includes(source);
}

export function isBannedRevenue(source: string): boolean {
  return (Object.values(BannedRevenue) as string[]).includes(source);
}

// Invariant: finding someone to talk to is never paywalled.
export function paywallsConnection(): false {
  return false;
}
