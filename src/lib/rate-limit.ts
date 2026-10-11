// In-memory token bucket per key (usually client IP).
// Correct for single-instance dev/small prod. Multi-instance deployments
// need a shared store (Redis) — flagged, not built (no infra in MVP).
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateRule {
  limit: number;
  windowMs: number;
}

// Returns true when the call is ALLOWED (and counted), false when limited.
export function checkLimit(key: string, rule: RateRule, now: number = Date.now()): boolean {
  const hit = buckets.get(key);
  if (!hit || now >= hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }
  if (hit.count >= rule.limit) return false;
  hit.count += 1;
  return true;
}

export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip || "unknown";
}

export function limitedResponse() {
  return Response.json({ error: "too-many-requests" }, { status: 429 });
}

// Presets: auth strict (credential attacks), writes moderate (spam control).
export const RATE = {
  auth: { limit: 10, windowMs: 60_000 },
  reset: { limit: 3, windowMs: 600_000 },
  write: { limit: 30, windowMs: 60_000 },
  report: { limit: 10, windowMs: 600_000 },
} as const satisfies Record<string, RateRule>;
