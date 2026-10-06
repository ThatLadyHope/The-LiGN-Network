// LiGN Phase 2 — §65 permission layers + precedence.
// Safety > Privacy > Blocking/boundaries > Account > Connection > Matching > Convenience.
export const PermissionLayer = {
  PUBLIC: "public",
  DISCOVERY_VISIBLE: "discovery-visible",
  CONNECTION_VISIBLE: "connection-visible",
  PRIVATE: "private",
  VERIFICATION: "verification",
  JOURNAL: "journal",
  SHARED_MEMORY: "shared-memory",
  SAFETY: "safety",
} as const;
export type PermissionLayer = (typeof PermissionLayer)[keyof typeof PermissionLayer];

const PRECEDENCE: PermissionLayer[] = [
  "safety",
  "private",
  "discovery-visible",
  "connection-visible",
  "public",
];

// Higher-priority restriction always wins. Returns true when access is denied.
export function isDeniedByPrecedence(
  checks: { layer: PermissionLayer; denied: boolean }[],
): boolean {
  const ordered = [...checks].sort(
    (a, b) => PRECEDENCE.indexOf(a.layer) - PRECEDENCE.indexOf(b.layer),
  );
  return ordered.some((c) => c.denied);
}

// Hardinvariants: these must never leak through discovery.
export function discoveryLeakCheck(layer: PermissionLayer): boolean {
  return (
    layer === "verification" ||
    layer === "journal" ||
    layer === "safety" ||
    layer === "private"
  );
}
