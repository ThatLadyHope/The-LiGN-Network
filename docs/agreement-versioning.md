# Agreement version bump checklist

No schema change is needed for a new version. History, re-acceptance, and
retrieval already handle multiple versions.

1. In `src/lib/agreement.ts`: append the new text as a dated constant
   (never edit `AGREEMENT_TEXT` of a published version), bump
   `AGREEMENT_VERSION`, and update `AGREEMENT_TEXT` to the new text.
2. Run the suite: version-gate tests fail until callers match the new version.
3. Existing users: on next login they route to `/agreement` automatically
   (`needsReaccept`), accept, and gain a second history row. Old rows stay.
4. Signup hook enforces the new version from deploy time; old-version
   claims reject.
5. Retrieval (`/api/admin/acceptances`, `getAcceptanceRecord`) shows every
   version per user — verify one multi-version account after rollout.
