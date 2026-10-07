// LiGN Phase 3 — profile + onboarding validation (PRD §6, §10, §11, §19, §42, §43, §75).
// No DB imports here: pure validation so it is unit-testable without Postgres.
import { z } from "zod";

// PRD §10 — the 10 supported connection intentions (UI may group them; matching uses exact values).
export const ConnectionIntention = z.enum([
  "casual-chat",
  "venting",
  "listening",
  "deep-conversation",
  "check-ins",
  "friendship",
  "pen-pal",
  "quiet-companionship",
  "shared-activity",
  "need-someone",
]);
export type ConnectionIntention = z.infer<typeof ConnectionIntention>;

// PRD §11 — expectations, not commitments.
export const ConnectionDuration = z.enum([
  "quick-chat",
  "today",
  "chat-buddy",
  "long-term-pen-pal",
  "see-where-it-goes",
]);
export type ConnectionDuration = z.infer<typeof ConnectionDuration>;

// PRD §8 — age bands. Thresholds undecided (assumption: 18+ default); under-18 never matched as adult.
export const AgeRange = z.enum(["under-18", "18-24", "25-34", "35-44", "45-54", "55-plus"]);
export type AgeRange = z.infer<typeof AgeRange>;

export function passesAgeSafety(ageRange: AgeRange): boolean {
  return ageRange !== "under-18";
}

// PRD §9 — coarse location only. Exact location is never stored or required.
export const LocationPreference = z.enum(["anywhere", "my-country", "nearby"]);
export type LocationPreference = z.infer<typeof LocationPreference>;

// PRD §19 — conversation preferences; may differ per connection.
export const ConversationPace = z.enum(["fast", "natural", "slow", "asynchronous", "pen-pal"]);
export const ConversationDepth = z.enum(["light", "moderate", "deep"]);
export const ConversationStyle = z.enum([
  "talkative",
  "quiet",
  "playful",
  "serious",
  "listener",
  "storyteller",
]);

// PRD §42 — discussion boundaries.
export const DiscussionBoundaries = z.object({
  comfortable: z.array(z.string()).default([]),
  sensitive: z.array(z.string()).default([]),
  offLimits: z.array(z.string()).default([]),
});
export type DiscussionBoundaries = z.infer<typeof DiscussionBoundaries>;

// PRD §43 — platonic by default; no dating mode.
export const RomanticBoundary = z.enum([
  "friends-only",
  "open-to-more",
  "not-interested",
  "not-sure",
]);
export type RomanticBoundary = z.infer<typeof RomanticBoundary>;

// PRD §75 — onboarding collects only what is needed for a first safe connection.
export const OnboardingMinimal = z.object({
  nickname: z.string().min(1).max(30),
  ageRange: AgeRange,
  currentNeeds: z.array(ConnectionIntention).min(1),
  language: z.string().min(2).max(10),
});
export type OnboardingMinimal = z.infer<typeof OnboardingMinimal>;

// PRD §6 — full progressive profile (filled in over time, never all required upfront).
export const ProfileUpdate = z.object({
  bio: z.string().max(500).optional(),
  ageRange: AgeRange.optional(),
  country: z.string().max(60).optional(),
  interests: z.array(z.string().max(40)).max(30).optional(),
  personality: z.array(z.string().max(40)).max(20).optional(),
  currentNeeds: z.array(ConnectionIntention).min(1).optional(),
  duration: ConnectionDuration.optional(),
  pace: ConversationPace.optional(),
  depth: ConversationDepth.optional(),
  styles: z.array(ConversationStyle).max(6).optional(),
  discussionBoundaries: DiscussionBoundaries.optional(),
  romanticBoundary: RomanticBoundary.optional(),
  locationPreference: LocationPreference.optional(),
  showLocalTime: z.boolean().optional(),
  language: z.string().min(2).max(10).optional(),
});
export type ProfileUpdate = z.infer<typeof ProfileUpdate>;

// PRD §7 — photos optional; avatars allowed; never rated or used for matching.
export const AvatarKind = z.enum(["avatar", "illustration", "photo", "none"]);
export type AvatarKind = z.infer<typeof AvatarKind>;
