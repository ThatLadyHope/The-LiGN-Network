# Deletion + retention (Phase 3, PRD §61)

## Pre-confirm screen must list
Account, personal information, connections, messages, journal, memories,
uploaded media, verification information.

## Cooling-off
Request records `requestedAt`; irreversible deletion no earlier than
`requestedAt + 14 days` (assumption — PRD gives no number).
During cooling-off the account rests PAUSED + NOT_DISCOVERABLE.
The user may cancel before the effective date.

## Retention disclosure (shown before confirmation)
- Safety/legal holds survive deletion and are named explicitly
  (e.g. active reports, blocks needed to prevent abuse).
- A deletion request never bypasses an active safety hold or erases
  information that must legitimately be retained.
- Other users receive only the minimum necessary information
  (e.g. the connection ends; no reason disclosed).

## Implementation notes
- `requestDeletion()` computes `effectiveAt`; a scheduled sweep finalizes
  DELETED only when `deletionIsEffective()` is true and
  `deletionBlockedBySafety()` is false.
- Verification data (§8, private) is deleted with the account except where
  a safety/legal hold applies — disclosed, never silent.
