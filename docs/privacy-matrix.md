# Privacy matrix (Phase 2, PRD §65)

| Layer | Visible to | Examples |
|---|---|---|
| public | anyone | nickname, bio (opt-in) |
| discovery-visible | matched candidates only | need, depth, style, interests, country (not exact) |
| connection-visible | mutual connection only | conversation prefs, boundaries |
| private | owner only | email, exact availability windows |
| verification | system only | age/identity evidence — never public, never a status |
| journal | owner only | Phase 10; never auto-shared |
| shared-memory | participants only | Phase 10; mutual consent + withdraw |
| safety | moderators only | reports, blocks, history — never public |

Precedence: Safety > Privacy > Blocking/boundaries > Account > Connection > Matching > Convenience.
Invariants: verification, journal, safety, private must never leak through discovery. Exact location never stored. Availability ≠ online status.
