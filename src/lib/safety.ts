// LiGN Phase 7 — safety controls, moderation, emergency (PRD §48, §51–§55).
// Text-only MVP: voice/video/recording appear as permission scaffolding only.

// PRD §55 — minimum 8 categories; different levels, different interventions.
export const SafetyCategory = {
  ORDINARY_INCOMPATIBILITY: "ordinary-incompatibility",
  DISCOMFORT: "discomfort",
  BOUNDARY_VIOLATION: "boundary-violation",
  HARASSMENT: "harassment",
  SERIOUS_VIOLATION: "serious-violation",
  CREDIBLE_THREAT: "credible-threat",
  EXPLOITATION: "exploitation",
  OTHER_HIGH_RISK: "other-high-risk",
} as const;
export type SafetyCategory = (typeof SafetyCategory)[keyof typeof SafetyCategory];

// Serious threats require immediate protective intervention (§54).
export function requiresImmediateProtection(category: SafetyCategory): boolean {
  return (
    category === "serious-violation" ||
    category === "credible-threat" ||
    category === "exploitation" ||
    category === "other-high-risk"
  );
}

// PRD §53 — Report → Protect → Review → Action → Appeal.
export const ReportState = {
  PENDING: "pending",
  PROTECTING: "protecting",
  IN_REVIEW: "in-review",
  ACTIONED: "actioned",
  APPEALED: "appealed",
  CLOSED: "closed",
} as const;
export type ReportState = (typeof ReportState)[keyof typeof ReportState];

const REPORT_FLOW: Record<Exclude<ReportState, "closed">, ReportState> = {
  pending: "protecting",
  protecting: "in-review",
  "in-review": "actioned",
  actioned: "appealed",
  appealed: "closed",
};

export function advanceReport(state: ReportState): ReportState {
  if (state === "closed") throw new Error("report: already closed");
  return REPORT_FLOW[state];
}

// A report never establishes guilt by itself.
export function reportEstablishesGuilt(): false {
  return false;
}

export const ProtectiveAction = {
  BLOCK: "block",
  REMOVE_PARTICIPANT: "remove-participant",
  END_SESSION: "end-session",
  RESTRICT_COMMUNICATION: "restrict-communication",
  TEMP_RESTRICTION: "temp-restriction",
  SUSPENSION: "suspension",
} as const;
export type ProtectiveAction = (typeof ProtectiveAction)[keyof typeof ProtectiveAction];

// PRD §51 — controls reachable with minimal effort during any interaction.
export const SafetyControl = {
  LEAVE: "leave",
  MUTE: "mute",
  BLOCK: "block",
  REPORT: "report",
} as const;
export type SafetyControl = (typeof SafetyControl)[keyof typeof SafetyControl];

// PRD §52 — blocking stops ALL ordinary interaction paths at once.
export interface BlockState {
  blocked: boolean;
}

export function ordinaryInteractionAllowed(block: BlockState): boolean {
  return !block.blocked;
}

// The blocked party receives only the minimum necessary information.
export function blockNoticeForBlockedParty(): { notice: "unavailable" } {
  return { notice: "unavailable" };
}

// PRD §48 — LiGN is not emergency care. Visible Get-Help-Now path only.
export const EmergencyResource = {
  EMERGENCY_SERVICES: "emergency-services",
  CRISIS_RESOURCES: "crisis-resources",
  TRUSTED_REAL_WORLD: "trusted-real-world-people",
  PROFESSIONAL_HELP: "professional-help",
} as const;
export type EmergencyResource = (typeof EmergencyResource)[keyof typeof EmergencyResource];

export function getHelpNow(): { resources: EmergencyResource[]; listenersAreResponders: false } {
  return {
    resources: [
      "emergency-services",
      "crisis-resources",
      "trusted-real-world-people",
      "professional-help",
    ],
    listenersAreResponders: false,
  };
}

// PRD §49–§50 — MVP is text-only. Voice/video/recording need explicit consent;
// private conversations are not routinely recorded.
export function requiresExplicitConsent(medium: "voice" | "video" | "recording"): true {
  void medium;
  return true;
}
