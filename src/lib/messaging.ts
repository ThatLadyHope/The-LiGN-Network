// LiGN Phase 5 — 1-on-1 text messaging helpers (PRD §19–§21).
// Text only in MVP. Starters and suggested replies are optional tools,
// never mandatory scripts. Silence is never interpreted.
import { z } from "zod";

// MVP: plain text, 1–2000 chars. No attachments/media (voice/video excluded).
export const MessageContent = z.object({
  text: z.string().min(1).max(2000),
});
export type MessageContent = z.infer<typeof MessageContent>;

// PRD §20 — reply expectations. Delayed replies mean nothing about the relationship.
export const ReplyExpectation = {
  NO_RUSH: "no-rush",
  SAME_DAY: "same-day",
  MAY_TAKE_DAYS: "may-take-days",
  ACTIVE_CHATS: "active-chats",
} as const;
export type ReplyExpectation = (typeof ReplyExpectation)[keyof typeof ReplyExpectation];

// PRD §21 — sample starter content (samples, not requirements).
export const STARTER_SAMPLES: string[] = [
  "What kind of connection are you hoping for today?",
  "Want to just vent for a bit? No fixing, just listening.",
  "Easy check-in: how has today actually been?",
];

export const NOT_SURE_WHAT_TO_SAY = "I'm not sure what to say";

export function freshStarter(previous: string[]): string {
  const unused = STARTER_SAMPLES.filter((s) => !previous.includes(s));
  return unused.length > 0 ? unused[0] : NOT_SURE_WHAT_TO_SAY;
}
