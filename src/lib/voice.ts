// LiGN Phase 10 — voice messages + live audio (PRD §49, Later Phase 2).
// Trust-gated, explicit permission, immediate leave, reporting always present.
// No auto-play. Text remains the baseline; voice never required.
import type { ConnectionState } from "./states";

export const VoiceKind = {
  MESSAGE: "voice-message",
  LIVE: "live-audio",
} as const;
export type VoiceKind = (typeof VoiceKind)[keyof typeof VoiceKind];

// Voice requires an established ACTIVE connection + explicit mic permission.
export function canStartVoice(connection: ConnectionState, micGranted: boolean): boolean {
  return connection === "ACTIVE" && micGranted;
}

export interface VoiceSession {
  kind: VoiceKind;
  active: boolean;
  autoPlay: false;
  reportingAvailable: true;
}

export function startVoice(kind: VoiceKind): VoiceSession {
  return { kind, active: true, autoPlay: false, reportingAvailable: true };
}

// Leaving is immediate and unconditional.
export function leaveVoice(session: VoiceSession): VoiceSession {
  void session;
  return { kind: session.kind, active: false, autoPlay: false, reportingAvailable: true };
}
