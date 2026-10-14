// Rotating journal prompts (Finch-style): one featured reflection per day,
// shared by everyone, plus free shuffling. Never mandatory — free writing
// always stays one tap away.
export const JOURNAL_PROMPTS: string[] = [
  "What's weighing on you today, in one honest sentence?",
  "Name one small good thing from the last 24 hours.",
  "What kind of connection do you need most right now?",
  "Write about someone who made you feel seen lately.",
  "What are you avoiding saying out loud?",
  "Describe today's mood as weather. What's the forecast?",
  "What did you need today that you didn't ask for?",
  "Write a two-line thank-you note you'll never send.",
  "When did you last feel truly listened to?",
  "What's one boundary you held recently — or wish you had?",
  "What does rest look like for you this week?",
  "Write about a small moment you'd hate to forget.",
  "What are you carrying that isn't yours?",
  "If loneliness had a shape today, what would it be?",
  "What made you smile today, even briefly?",
  "Write about a conversation that stayed with you.",
  "What do you want more of in your days?",
  "What do you want less of?",
  "Describe a place where you feel completely at ease.",
  "What would you tell a friend feeling exactly like you do now?",
  "What part of today deserves a second look?",
  "Write about something you're looking forward to.",
  "What have you outgrown recently?",
  "What does a good connection feel like in your body?",
  "Write about a time silence said everything.",
  "What's one thing you're proud of that nobody saw?",
  "If today had a title, what would it be?",
  "What are you grateful someone did for you lately?",
  "Write about what home means to you right now.",
  "What would make tomorrow 1% gentler?",
];

// Deterministic by calendar day (local time): everyone gets the same prompt,
// and it advances on its own — no storage, no network.
export function promptForDate(date: Date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0).getTime();
  const day = Math.floor((date.getTime() - start) / 86400000);
  return JOURNAL_PROMPTS[((day % JOURNAL_PROMPTS.length) + JOURNAL_PROMPTS.length) % JOURNAL_PROMPTS.length];
}

// A different prompt than the one showing (wraps around the list).
export function anotherPrompt(current: string): string {
  const idx = JOURNAL_PROMPTS.indexOf(current);
  const next = idx < 0 ? 0 : (idx + 1) % JOURNAL_PROMPTS.length;
  return JOURNAL_PROMPTS[next];
}
