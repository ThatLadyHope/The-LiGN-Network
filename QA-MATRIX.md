# QA matrix — MVP acceptance (§68) + edge cases (§69)

Status key: PASS = covered by an automated test below; MANUAL = needs human walkthrough.

## §68 acceptance

| Area | Criterion | Test |
|---|---|---|
| Matching | eligible matched | PASS `tests/matching.test.ts` eligibility |
| Matching | ineligible never matched | PASS same file, all 9 blocks |
| Matching | blocked never appear | PASS blocked either direction |
| Matching | unavailable not shown available | PASS discoverable filter |
| Matching | need influences compatibility | PASS need-outranks-interests |
| Matching | no fabricated human | PASS empty-rank + honest fallback |
| Connection | mutual required | PASS `tests/connections.test.ts` requests |
| Connection | states transition correctly | PASS lifecycle order |
| Connection | end never auto-reopens | PASS reconnection closed |
| Connection | reconnection mutual-only | PASS ender controls |
| Blocking | interaction stopped | PASS `tests/safety.test.ts` block semantics |
| Blocking | new requests prevented | PASS eligibility + block |
| Blocking | discovery exclusion | PASS discoverable filter |
| Blocking | bypasses prevented | PASS all-paths block + minimal notice |
| Reporting | submitted easily | MANUAL review-queue UI |
| Reporting | protective action occurs | PASS flow advance + immediate protection |
| Reporting | review begins | PASS flow advance |
| Reporting | evidence handled | MANUAL retention sweep |
| Reporting | false positives reviewable | PASS appeal state |
| Reporting | appeals work | PASS appeal → closed |
| Pause | leaves discovery | PASS `tests/account.test.ts` pause |
| Pause | connections remain | PASS resume preserves (no connection mutation) |
| Pause | matching stops | PASS `tests/matching.test.ts` paused frequency |
| Pause | restore works | PASS resume |
| Deletion | consequences shown | PASS 8-item list |
| Deletion | correct deletion state | PASS cooling-off math |
| Deletion | retention respected | MANUAL legal sign-off |
| Deletion | others told minimum | PASS block/reconnect silence rules |
| Spaces | capacity respected | PASS `tests/listening.test.ts` cap |
| Spaces | expiry closes | PASS expiry |
| Spaces | no participation after close | PASS join-refused |
| Spaces | creator early end | PASS creator-only end |
| Spaces | reconnection per rules | PASS mutual-only post-space |
| Privacy | nothing leaks via discovery | PASS `tests/foundation.test.ts` leak |
| Privacy | journal private | PASS stub + layers |
| Privacy | verification private | PASS leak check |
| Privacy | no exact location | PASS coarse-only schema (no exact field exists) |
| Privacy | trusted grants nothing | PASS `tests/safety.test.ts` label |

## §69 edge cases (all PASS in unit tests unless marked MANUAL)

Account: pause-while-discoverable, pause-in-connection, delete-in-conversation
(logic), return-after-pause, inactivity → NOT_DISCOVERABLE.
Matching: no-compatible-user, single-user, candidate-unavailable,
candidate-blocked, already-connected, need-changed (re-rank).
Connections: both-accept, accept/decline split, simultaneous end, one-pauses,
one-blocks, one-deletes (MANUAL cross-entity UI), reconnect allowed/prohibited.
Spaces: creator-leaves (transfer assumption), participant-leaves, capacity,
expiry, early-end, report-during, report-after-window.
Safety: mutual reports, report-after-block, false-positive appeal, repeat
violations (threshold signal), serious threat (immediate protection).
No-human: all four fallbacks render honest empty (MANUAL UI copy check).
