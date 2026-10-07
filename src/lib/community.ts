// LiGN Phase 10 — Trusted Person (full), translation, local communities.
// Trusted: explicit user-controlled permissions, still never auto-access and
// never an emergency contact. Translation: opt-in offer. Communities: 3–8,
// chronological only, no ranking.

export interface TrustedPermissions {
  seeAvailability: boolean;
  seeJournal: boolean;
  contactOnWorry: boolean;
}

export interface TrustedPerson {
  ownerId: string;
  trustedId: string;
  permissions: TrustedPermissions;
  isEmergencyContact: false;
}

export function grantTrusted(
  ownerId: string,
  trustedId: string,
  permissions: TrustedPermissions,
): TrustedPerson {
  return { ownerId, trustedId, permissions, isEmergencyContact: false };
}

export function revokeTrusted(t: TrustedPerson): TrustedPerson {
  return {
    ...t,
    permissions: { seeAvailability: false, seeJournal: false, contactOnWorry: false },
  };
}

// No permission exists without an explicit grant call above.
export function defaultTrustedPermissions(): TrustedPermissions {
  return { seeAvailability: false, seeJournal: false, contactOnWorry: false };
}

// Translation (PRD §56): offered, never forced; cultural similarity never boosts.
export function translationOfferedFull(optedIn: boolean): boolean {
  return optedIn;
}

export interface LocalCommunity {
  id: string;
  name: string;
  place: string;
  memberIds: string[];
}

export function createCommunity(
  id: string,
  name: string,
  place: string,
  memberIds: string[],
): LocalCommunity {
  if (memberIds.length < 3 || memberIds.length > 8) {
    throw new Error("community: members must be 3–8");
  }
  return { id, name, place, memberIds };
}

// Chronological only: listing preserves insertion order, never ranks.
export function listCommunities(communities: LocalCommunity[]): LocalCommunity[] {
  return [...communities];
}
