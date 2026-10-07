// LiGN Phase 11 — video + recording consent (PRD §49, §50, Later Phase 3).
// Trust-gated, explicit permissions, no auto-activation, immediate leave.
// No routine recording; safety-report retention is limited and access-gated.

import type { ConnectionState } from "./states";

export interface MediaPermissions {
  mic: boolean;
  camera: boolean;
}

// Video needs MORE trust than voice: ACTIVE connection + both permissions.
export function canStartVideo(connection: ConnectionState, perms: MediaPermissions): boolean {
  return connection === "ACTIVE" && perms.mic && perms.camera;
}

export interface VideoSession {
  active: boolean;
  autoActivated: false;
  reportingAvailable: true;
}

export function startVideo(): VideoSession {
  return { active: true, autoActivated: false, reportingAvailable: true };
}

export function leaveVideo(session: VideoSession): VideoSession {
  void session;
  return { active: false, autoActivated: false, reportingAvailable: true };
}

// Recording consent must be explicit from EVERY participant, every time.
export function recordingConsented(consents: boolean[]): boolean {
  return consents.length > 0 && consents.every(Boolean);
}

export const SAFETY_RETENTION_DAYS = 30; // Assumption — PRD demands strict limits, no number.
export const SAFETY_ACCESS_ROLES = ["moderator"] as const;

// Retained safety recordings: limited window, moderator-only access.
export function safetyRecordingRetained(daysOld: number, role: string): boolean {
  if (daysOld > SAFETY_RETENTION_DAYS) return false;
  return (SAFETY_ACCESS_ROLES as readonly string[]).includes(role);
}
