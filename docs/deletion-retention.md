# Deletion + retention (Phase 3, PRD §61)

## Pre-confirm screen must list
Account, personal information, connections, messages, journal, memories,
uploaded media, verification information.

## Cooling-off
Request records `requestedAt`; irreversible deletion no earlier than
`requestedAt + 30 days` (product decision — recover by simply logging in).
During cooling-off the account rests PAUSED + NOT_DISCOVERABLE.
Signing in inside the window cancels the request and restores the account.
Past the window, signing in finalizes the purge automatically and reports
the account gone — joining again starts fresh. A past-window purge never
runs while a safety hold is open.

## Retention disclosure (shown before confirmation)
- Safety/legal holds survive deletion and are named explicitly
  (e.g. active reports, blocks needed to prevent abuse).
- A deletion request never bypasses an active safety hold or erases
  information that must legitimately be retained.
- Other users receive only the minimum necessary information
  (e.g. the connection ends; no reason disclosed).

## What the purge removes vs keeps
Removed at finalization: sessions, accounts, availability, listener queue
entry, blocks placed by the leaver, reconnect wishes, deletion feedback,
then the user row itself.
Kept: connections, conversations, messages, reports, blocks others placed
(all shared history or safety retention). Other users see "Someone" where
a name used to be.

## Implementation notes
- `requestDeletion()` computes `effectiveAt`; a scheduled sweep finalizes
  DELETED only when `deletionIsEffective()` is true and
  `deletionBlockedBySafety()` is false.
- Verification data (§8, private) is deleted with the account except where
  a safety/legal hold applies — disclosed, never silent.
