// LiGN Phase 8 — private search + language stub (PRD §59, §56).
// No public people directory. Translation engine arrives in Phase 10.

export interface OwnConnectionRecord {
  ownerId: string;
  nickname: string;
  interests: string[];
  topics: string[];
}

// Owner-scoped by construction: the query carries ownerId and only that
// owner's records are ever examined. There is no all-users search path.
export function searchOwnHistory(
  ownerId: string,
  records: OwnConnectionRecord[],
  query: string,
): OwnConnectionRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return records.filter(
    (r) =>
      r.ownerId === ownerId &&
      (r.nickname.toLowerCase().includes(q) ||
        r.interests.some((i) => i.toLowerCase().includes(q)) ||
        r.topics.some((t) => t.toLowerCase().includes(q))),
  );
}

export interface LanguagePrefs {
  preferred: string;
  comfort: string[];
  cultural: string[];
}

// MVP stores preferences only. No translation engine, and cultural
// similarity is never treated as better compatibility.
export function translationOffered(): false {
  return false;
}

export function culturalBoost(): 0 {
  return 0;
}
