// LiGN Phase 2 — auth skeleton (Better Auth wired in Phase 3). No external imports here.
export interface SessionUser {
  id: string;
  nickname: string;
}

export interface SafetyAuditEvent {
  actorId: string;
  action: string;
  targetId?: string;
  at: string;
}

export function auditEvent(actorId: string, action: string, targetId?: string): SafetyAuditEvent {
  return { actorId, action, targetId, at: new Date().toISOString() };
}
