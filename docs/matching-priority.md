# Matching priority (Phase 4, PRD §12)

Order (need dominates by weight 100; next highest is availability at 40):

1. Current need — 100 per satisfied need, via the compatibility matrix
   (not mere overlap). Support needs pair complementarily; all others mirror:
   - listening → venting, need-someone (never another listener)
   - venting → listening
   - need-someone → listening
   - casual-chat, deep-conversation, check-ins, friendship, pen-pal,
     quiet-companionship, shared-activity → their own kind only.
2. Availability — 40 per shared type.
3. Conversation depth — 25 on exact match.
4. Conversation style — 20 per shared style.
5. Personality — 15 per shared tag (MVP: plain tag overlap, never opaque scoring).
6. Language — 12 on exact match.
7. Shared interests — 10 per shared interest.
8. Life experience — 8 per shared opt-in tag. Opt-in only, never inferred.
9. Time zone — 5 on exact match.
10. Location preference — 5 on exact match.

Hard filters run BEFORE scoring (§13): block either direction, age-safety,
safety restriction, NOT_DISCOVERABLE, user restriction, previously
rejected/prohibited, already connected.

Bans (by construction — no such inputs exist in `MatchCandidate`):
popularity, appearance, follower count, engagement, social status.

No-match: honest fallback list only (broaden / try later / listener queue /
temp space / activity / reflection). AI may assist navigation, never appear
as the human match. `rankCandidates` returns `[]` when nobody is eligible;
callers must render the fallback, never invent a user.
