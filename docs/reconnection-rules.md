# Reconnection rules (Phase 5, PRD §29–§30)

1. A previous relationship NEVER reopens automatically — not on a message,
   not on app open, not on anything unilateral.
2. Reopening requires new mutual interaction (both parties interested).
3. If the connection was intentionally ended, the person who ended it
   controls reconnection: allow | temp-block | permanent-block.
4. No surprise messages: a blocked reconnection attempt sends nothing.
5. The other person is NEVER notified when reconnection is blocked.
6. Simultaneous end: first end wins; result is ENDED once with the first
   ender's rule (default: allow).
7. Future reminders (later / this week / on date / custom) are private.
   They never notify the other person and never reopen anything by themselves.

Thresholds assumed (PRD silent): repeated-unwanted-requests flag at 3
declined/ignored requests; silence nudge after 7 days, max 1 per 14 days.
