# LiGN Network — Full Implementation Plan (MVP + Complete Vision)
Source: `The_LiGN_Network_Updated_Implementation_Ready_PRD.md` §§1-78 only. Appendices ignored.
Loop: Need → Human → Conversation → Mutual Connection → Relationship.
Journey: Need → Find → Connect → Evolve.
Rules: simplest compliant; no feeds/likes/followers/streaks/dating/AI-humans/large communities; Safety > Privacy > Blocking > Account > Connection > Matching > Convenience.

How to use: say `go phase N` (e.g. `go phase 3`). I will execute only that phase's Tasks, produce its Outputs, run its Tests, and stop at its Gate. I will not start the next phase or push without explicit instruction.

---

## Phase 1 — Plan lock
Objective: Freeze scope so later phases cannot diverge.
PRD: §4 MVP boundary, §66 MVP, §66 exclusions, §67 later releases, §74 builder rules, §77 DoD.
Tasks:
1. Confirm MVP = §66 only. §67 explicitly out of MVP.
2. Record states §63, transitions §64, entities §62, precedence §65, acceptance §68, edges §69, DoD §77.
3. Record open questions as assumptions (see Unresolved at end). Do not invent requirements.
Outputs: this file, `docs/scope-mvp.md`, `docs/test-strategy.md`.
Dependencies: none. Blocks all.
Tests: review-only — every §66 item mapped to Phases 2-9, every §67 item mapped to Phases 10-11.
Gate: plan accepted. No build code in this phase.

## Phase 2 — Foundation: states, schema, privacy
Objective: Lock state machines, data model, permission order.
PRD: §62 entities, §63 states, §64 transitions, §65 permissions.
Tasks:
1. Centralized enums: Account ACTIVE/PAUSED/DELETED; Discovery DISCOVERABLE/NOT_DISCOVERABLE; Connection STRANGER/CONVERSATION/MUTUAL_CONNECTION/ACTIVE/PAUSED/ARCHIVED/ENDED; Safety NORMAL/FLAGGED/RESTRICTED/SUSPENDED/REMOVED. Enforce independence.
2. Transition guards: STRANGER→CONVERSATION; CONVERSATION→MUTUAL_CONNECTION→ACTIVE; ACTIVE→PAUSED→ACTIVE; ACTIVE→PAUSED→ARCHIVED; ACTIVE→ENDED; ARCHIVED/ENDED→new mutual→ACTIVE. Never auto-reopen on single message.
3. Schema: User(identity, profile, age/safety, prefs, language, verification, account state); Availability(types, windows, temp state, discovery state); Connection(2 users, state, duration intent, timestamps, pause/archive/end info); ConnectionRequest(sender, recipient, note, state, timestamps); Conversation(participants, connection ref, type, retention); Message(conversation, sender, content, timestamp, moderation, deletion); TemporarySpace(creator, purpose, duration, capacity 3-8, participants, lifecycle); Report(reporter, target, category, evidence, review, action, appeal); Block(blocker, blocked, time, expiry). Add Schedule/JournalEntry/SharedMemory/TrustedPerson as nullable stubs only (no logic in MVP).
4. Permission layers: public / discovery-visible / connection-visible / private / verification / journal / shared-memory / safety. Enforce precedence Safety>Privacy>Blocking>Account>Connection>Matching>Convenience. No cross-layer inheritance.
5. Auth skeleton + request identity middleware + safety audit log.
Outputs: `db/migrations/0001_foundation`, state-guard module, privacy module, `docs/privacy-matrix.md`.
Dependencies: Phase 1.
Tests: illegal transition rejected; enum independence; verification/journal/safety never leak to discovery.
Gate: all guards + precedence pass. No feature code yet.

## Phase 3 — Account, profile, onboarding
Objective: Join safely with minimal setup; leave safely.
PRD: §5 identity, §6 profile, §7 photos, §8 age/verification, §9 location, §17-18 states/pause, §61 deletion, §75 onboarding.
Tasks:
1. Register/login, one identity per account, nickname/pseudonym. No multi-persona.
2. Onboarding minimal: nickname + age-safety + current need + language. Defer rest progressively.
3. Profile CRUD: bio, age range, country/region, interests, personality Qs, needs, pace/depth/style, availability summary, discussion + romantic boundaries, language. Photos optional (avatar allowed). No ratings/likes/leaderboards, no appearance matching.
4. Age-safety: minimum enforcement data stored; verification private; safety overrides matching.
5. Location: Anywhere/My country/Nearby only; never store exact; optional local-time display.
6. Pause: remove from discovery, block new requests, preserve connections/data, optional return period + auto-restore. Reversible.
7. Delete: pre-confirm consequences (account, profile, connections, messages, journal, memories, media, verification), cooling-off, disclose legal/safety retention, never bypass active safety retention.
Outputs: auth, users, onboarding, profile modules, `docs/deletion-retention.md`.
Dependencies: Phase 2.
Tests: one-identity enforced; minor safety blocks; pause removes from discovery but keeps connections; delete flow + disclosure; no appearance sorting exists.
Gate: DoD 1,2,4,12 demonstrable.

## Phase 4 — Availability, discovery, need-first matching
Objective: State a need, see eligible humans, honest no-match.
PRD: §10 intentions, §11 duration, §12 matching, §13 eligibility, §14 discovery, §15-16 availability.
Tasks:
1. Availability per type (casual, vent/listen, deep, pen pal, check-ins, quiet) + windows + temp states (need space/low energy/just listening/back later, auto-expire). Temp never ends connections. Exact online status never broadcast. Availability separate from account/discovery/connection state.
2. Discovery frequency Daily/Weekly/Paused; paused affects discovery only.
3. Eligibility hard filters before scoring: block either direction, age-safety, safety restriction, NOT_DISCOVERABLE, user restrictions.
4. Compatibility priority: need > availability > depth > style > personality > interests > life experience > language > timezone > location. Need strongest. No popularity/appearance signals. Never expose sensitive signals. Never re-surface rejected/blocked. Never fabricate match.
5. No-match screen: broaden / try later / listener queue / temp space / activity / reflection prompt. AI navigation help only, never as human.
Outputs: availability, matching, discover modules, `docs/matching-priority.md`.
Dependencies: Phase 3.
Tests: blocked/ineligible never suggested; need outranks interests; unavailable not shown available; no-match honest fallback. §69 Matching edges.
Gate: Acceptance Matching green.

## Phase 5 — 1-on-1 lifecycle + text messaging (core)
Objective: Deliver the heart: 1-on-1 platonic connection.
PRD: §19-21 prefs/starters, §22 requests, §23-25 lifecycle/accept, §26-27 silence/one-sided, §28-30 ending/reconnection.
Tasks:
1. Requests with sender context + reason + optional note; Accept/Decline/Ignore; mutual required; repeated unwanted = safety signal.
2. Lifecycle per Phase 2; actions Continue/Pause/Archive/End. No forced friendship label.
3. Accepted screen: Chat now / Send message / Save for later. Nothing automatic.
4. 1-on-1 text only. Optional starters/suggested replies/fresh starters/not-sure-what-to-say. Reply expectations (no rush/same day/may take days/active). Never imply silence=rejection; gentle prompt only after meaningful inactivity with frequency cap; auto-pause allowed.
5. One-sided: offer Pause/Need space/End/Reconnect later, no blame.
6. End without explanation; optional reason + closing message. Reconnection mutual-only; ender controls allow/temp-block/permanent-block; blocked party not notified; private future-reminder with no auto-notify.
Outputs: connections, messages, chat UI, `docs/reconnection-rules.md`.
Dependencies: Phase 4.
Tests: mutual required; ended never auto-reopens; reconnection allow/temp/permanent; simultaneous end; pause preserves history. §69 Connections edges.
Gate: Acceptance Connection + DoD 5-9.

## Phase 6 — Listening, immediate need, temp spaces (3-8 only)
Objective: Urgent/support needs + small temp groups, no communities.
PRD: §32-34 listening/need-someone, §37-38 spaces, §39-40 groups minimal, §36 activities secondary.
Tasks:
1. Vent modes: Just Listen / Advice Welcome / Don't Know; changeable mid-chat; peer ≠ professional care.
2. Listener Mode voluntary opt-in/out, anonymous need-someone requests, time-limited sessions, listener never responsible for safety.
3. I-Need-Someone routing: 1-on-1 → listener queue → small Need-Someone room → saved-connection shortcut stub (Trusted enhancements deferred). Honest empty state; never AI as human.
4. Spaces: 3-8 only, purpose + duration (15m/30m/1h/2h + custom within limits), auto-close, creator early-end, free leave, never permanent by default. Define join/leave/creator-leave/early-close/expire/report-after-closure. Cap enforced.
5. Post-space: private talk-again → new connection only on mutual; unilateral hidden.
6. Groups/board minimal: small-group opportunities list only, no algorithmic global feed, no hosting obligations.
Outputs: listeners, spaces, need-someone modules.
Dependencies: Phase 5.
Tests: capacity enforced; expiry closes; post-expiry participation blocked; creator-leave behavior; report during + after closure; no-human fallback honest. Acceptance Spaces + §69 Spaces/No-match.
Gate: listener + spaces demoable without breaking 1-on-1 core.

## Phase 7 — Boundaries, private trust, safety, moderation, emergency
Objective: Enforce agency and safety before launch.
PRD: §41-43 privacy/boundaries, §44-46 trust/conflict/apology, §47 Trusted minimal, §48 emergency, §51-55 controls/moderation, §49-50 text-only scaffolding.
Tasks:
1. Boundaries per-connection + global + presets (no number, no socials, no romantic/sexual, no unsolicited advice, short-only, respect privacy). Repeated post-refusal requests → boundary-violation signal.
2. Progressive disclosure Nickname→Basic→Familiar→Trusted; contact share voluntary + privacy reminder.
3. Trust private-only (respectful/listener/friendly/boundaries/uncomfortable); no public scores/ratings/leaderboards. Conflict Something-feels-off → Clarify/Boundary/Pause/Leave/Report; repair optional. Apology structured, no forgiveness demand, never erases safety record.
4. Trusted Person MVP: private label only, no authority/access/disclosure; not emergency contact.
5. Safety controls always reachable: Leave/Mute/Block/Report. Block: immediate stop, no messages/requests/discovery/bypass across surfaces; minimal info to blocked party.
6. Moderation Report→Protect→Review→Action→Appeal; 8 categories minimum; auto-detect flags only, no permanent severe auto-penalty in ordinary cases; immediate protection for serious threats; human review queue + evidence + appeal.
7. Emergency: visible Get Help Now → emergency/crisis/real-world/professional; listeners never responders; no internal emergency contacts.
8. Voice/video: text-only MVP; permission/consent scaffolding only; no routine recording.
Outputs: safety (blocks, reports, reviews, appeals), boundaries UI, `docs/safety-categories.md`, `docs/moderation-flow.md`.
Dependencies: Phases 5+6.
Tests: Acceptance Blocking/Reporting/Privacy; §69 Safety edges (mutual reports, post-block report, appeal, repeat violations, serious threat).
Gate: safety walkthrough passes; no bypass found.

## Phase 8 — Notifications, private search, polish
Objective: Notify without manipulation; private memory only.
PRD: §57 notifications, §59 search, §56 language stub.
Tasks:
1. Notifications for requests, accepts, messages, safety events only. Category toggles + quiet hours + global pause. Ban streak/guilt/urgency prompts.
2. Private search own history only; no public directory.
3. Language: store preference/comfort only; no translation engine in MVP.
4. Final Product Test per feature.
Outputs: notifications, settings, private search.
Dependencies: Phase 7.
Tests: quiet hours suppress; pause stops non-safety; no guilt copy.
Gate: DoD 10,11,13,14.

## Phase 9 — MVP acceptance + release readiness (no new features)
Objective: Prove 14-point DoD.
PRD: §68 acceptance, §69 edges, §77 DoD, §70-71 metrics, §76 final test.
Tasks:
1. Full matrix: matching, connection, blocking, reporting, pause, deletion, spaces, privacy.
2. §69 edge matrix (account/matching/connections/spaces/safety/no-human).
3. Instrument North Star only: meaningful mutual connections (voluntary + actual interaction + not immediately ended + still voluntary). No engagement incentives.
4. Retention docs, safety-response docs (SLAs marked assumption if absent), copy review.
Outputs: `docs/release-checklist.md`, `QA-MATRIX.md`, metrics stub, signed DoD 1-14.
Dependencies: all Phases 1-8.
Tests: full §68 + §69 pass.
Gate to MVP launch: all green. §67 explicitly out.

## Phase 10 — Complete vision A (PRD Later Phase 2)
Objective: Add deferred human-connection depth, still 1-on-1 heart + 3-8 only.
PRD: §67 Phase 2, plus full text of §31 scheduling, §35 quiet companionship, §36 activities, §47 trusted, §49 voice/audio, §56 translation, §58 journal, §60 memories, §39 communities.
Tasks:
1. Voice messages + Live audio with trust/safety gates, explicit mic permission, immediate leave, reporting. No auto-play.
2. Scheduling + recurring: exact/flexible time, reschedule/cancel/pause/change/end recurrence. No penalties/streaks/guilt. Notifications hook (extends Phase 8).
3. Quiet companionship full: text presence + optional voice, time-limited, no continuous conversation required.
4. Shared activities full: Match→Activity and Activity→Match; activities secondary to connection.
5. Journal private: notes/moments/topics/reminders/reflections; never auto-shared; powers private search.
6. Shared memories: mutual participation required; withdraw removes from withdrawer's view, notifies other without reason; other may retain personal version.
7. Trusted Person full: explicit user-controlled permissions only (still no auto access); still not emergency contact.
8. Translation: preference/comfort + auto-translation offer; cultural similarity never auto-better compatibility.
9. Local communities minimal, 3-8 only, no feed ranking.
Outputs: voice/audio, scheduling, quiet, activities, journal, memories, trusted-full, translation modules + docs updates.
Dependencies: Phase 9 (MVP stable). Needs Phase 5 lifecycle, Phase 6 spaces, Phase 7 safety, Phase 8 notifications.
Tests: per-feature acceptance + §68 regressions; scheduling no-penalty test; memory withdraw test; translation opt-in test; voice permission/leave/report test.
Gate: MVP regressions green + new features meet Final Test §76.

## Phase 11 — Complete vision B (PRD Later Phase 3)
Objective: Video + advanced depth without breaking principles.
PRD: §67 Phase 3, §49 video, §50 recording, advanced spaces/activities/trust/language/matching.
Tasks:
1. Video trust-gated, explicit camera/mic permission, no auto-activation, immediate leave, accessible reporting.
2. Recording: no routine recording; explicit consent required; limited safety-report retention, strictly limited access.
3. Advanced temp spaces + activity integrations (still 3-8, auto-close, no permanent by default).
4. Advanced trust (still private-only, no public scores/leaderboards).
5. Expanded language support + sophisticated matching (need remains strongest; no popularity/appearance signals).
Outputs: video, recording-consent, advanced spaces/activities/trust/language/matching.
Dependencies: Phase 10.
Tests: permission/consent/leave/report tests; retention/access tests; matching still need-first + no-fabrication tests.
Gate: full vision meets §68 + §76.

## Phase 12 — Full vision release readiness
Objective: Prove complete LiGN.
Tasks: full §68 + §69 + §77 on all features; North Star instrumentation; retention/SLA docs finalized; monetization guardrails check (§72 core free, never monetize loneliness/attention/popularity/access/being heard/emergency).
Outputs: full release checklist, QA matrix, metrics dashboard.
Dependencies: Phase 11.
Gate: launch complete vision.

---

## Ordered phase list
1 plan lock → 2 foundation → 3 account/profile → 4 matching → 5 1-on-1 core → 6 listening/spaces → 7 safety/moderation → 8 notifications/search → 9 MVP release → 10 vision A → 11 vision B → 12 full release.

## Outputs per phase
1 plan docs; 2 migrations + guards + privacy matrix; 3 auth/users/profile + deletion doc; 4 availability/matching/discover + priority doc; 5 connections/messages/chat + reconnection doc; 6 listeners/spaces/need-someone; 7 safety/blocks/reports/appeals/boundaries + safety docs; 8 notifications/search; 9 QA matrix + release checklist + metrics stub; 10 voice/scheduling/quiet/activities/journal/memories/trusted/translation; 11 video/recording/advanced; 12 full checklist.

## Dependency overview
1 blocks all. 2 blocks all build. 3→4→5 strictly sequential. 6 needs 5. 7 needs 5+6. 8 needs 7. 9 needs 1-8. 10 needs 9. 11 needs 10. 12 needs 11. Never parallelize safety before lifecycle stable. Never build §67 before MVP gate.

## Recommended order
Execute 1→12 in order. Say `go phase N` to execute one phase only.

## Unresolved / underspecified (do not invent)
1. Age thresholds/jurisdictions — `...:188` no numbers. Assume 18+ default, TBD.
2. Verification provider — `...:190` undefined. Assume self-attestation + stub.
3. Inactivity meaningful period + caps — `...:575` no numbers. Assume 7 days, max 1/14d.
4. Custom space max — `...:768` unspecified. Assume max 4h.
5. Creator-leaves-space — `...:776` required but unspecified. Needs decision.
6. Report-after-closure retention — unspecified. Assume 30-day hold, needs legal.
7. Cooling-off length — `...:1214` unspecified. Assume 14 days.
8. Legal/safety retention inventory — `...:1216` unspecified.
9. Life-experience signal collection — `...:265` sensitive. Assume opt-in tags only.
10. Personality algorithm — unspecified. Assume tag overlap, no opaque scoring.
11. Safety SLAs — `...:1650` no targets. Open.
12. Availability windows vs excluded scheduling — assume declarative only in MVP.
13. Trusted shortcut in need-someone routing `...:692` vs deferred enhancements — assume saved-connection stub in MVP.
14. Board scope vs no-feed — `...:809` undefined. Assume chronological small-group list, no ranking.
15. Language depth — store-only in MVP.
16. Scheduling mentions vs MVP exclusion — stubs only until Phase 10.
17. Quiet companionship full vs MVP exclusion — text-presence only until Phase 10.
18. Journal in search `...:1169` vs Journal excluded — topics-only until Phase 10.
