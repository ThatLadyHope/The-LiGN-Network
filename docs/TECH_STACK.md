# LiGN — Technology Stack (Local-First)
Source: `The_LiGN_Network_Updated_Implementation_Ready_PRD.md` §§1-78 and `docs/IMPLEMENTATION_PLAN_FULL.md` Phases 1-12.
Constraint: MVP is text-only 1-on-1 + 3-8 spaces. No voice/video/scheduling/journal/memories/translation in MVP (Phase 10-11 later). Stack must support MVP now without rewrite for vision.

## Local Development Architecture

How the app runs locally:
Single process on the developer machine. Next.js serves both the web UI and the JSON API via Route Handlers. No separate backend server, no Docker, no cloud.

How the database runs locally:
SQLite file database, no server process. File lives at `db/dev.db` (created on first migrate). Zero install beyond the npm package.

How the application connects to the database:
Prisma ORM reads `DATABASE_URL` from `.env`:
DATABASE_URL="file:./db/dev.db"
Prisma Client is the only DB access path. Migrations in `db/migrations/` (matches Phase 2 output).

Where uploaded files are stored locally:
Local folder `uploads/` in the project root (avatars/illustrations only — photos optional per PRD §7). Served by the app in dev only. Git-ignored except `.gitkeep`.
Production later: S3-compatible object storage (not used in local dev).

How authentication works locally:
Local email + password (bcrypt hash) with DB-backed sessions (JWT). No third-party login provider needed locally.
Production later: add email verification / OAuth provider and verified age-check vendor. PRD verification method is unspecified, so local keeps a stub field.

Required environment variables (.env, never committed):
DATABASE_URL="file:./db/dev.db"
AUTH_SECRET="dev-only-random-string"
UPLOADS_DIR="./uploads"

Required local dependencies/services:
- Node.js 20 LTS + npm (only install required)
- No database server, no Redis, no Docker, no paid services

Commands to start dev:
npm install
npx prisma migrate dev
npm run dev
App at http://localhost:3000, API at http://localhost:3000/api/*.

## Technology Stack

| Area | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router, React, TypeScript) | One codebase for UI + API routes; keeps 1-on-1 chat, discovery, spaces UI and backend together |
| Backend runtime | Node.js 20 LTS (inside Next.js) | Single runtime, no separate server process |
| Database | SQLite via better-sqlite3 | Local file DB; matches PRD entities without running Postgres |
| ORM | Prisma 5 | Typed access, migrations for User/Connection/Message/Report/Block etc. |
| Authentication | Local credentials: bcrypt + JWT sessions in DB | Dev-friendly, no external provider; production swaps to verified provider later |
| File Storage | Local filesystem uploads/ | Avatars/illustrations; production later S3-compatible |
| API layer | REST JSON via Next.js Route Handlers | Simple CRUD for profiles, requests, messages, spaces, reports; no GraphQL |
| Testing | Vitest (+ Testing Library for UI) | Unit + API route tests per phase; state-guard, eligibility, block, reconnection tests |
| Validation | Zod | Enforce transition guards and input shapes server-side |

Why this fits LiGN: MVP is text-only 1-on-1 + small spaces — no realtime engine, no media pipeline, no feed ranking. SQLite handles MVP scale locally; Prisma models the §62 entities directly; REST keeps the AI agent's work small and reviewable. Nothing here permits likes/followers/streaks (PRD §74 bans them).

Production path (not used now): SQLite → Postgres via Prisma provider switch (no model changes); local auth → OAuth/email-verify + age-check vendor; local disk → S3-compatible; polling → WebSocket/SSE only when Phase 10 voice/live and Phase 11 video demand it; Node timers → managed jobs/queue only at scale.

## Decisions and Assumptions

1. PRD specifies no stack. Chose TypeScript throughout to minimize context switching for the AI agent.
2. Chose SQLite over Postgres: PRD has no scale requirement; local-file DB removes the biggest beginner blocker (running a DB server). Production can migrate to Postgres later via Prisma with no model changes.
3. Chose Next.js monolith over separate api/ + web/ servers: fewer processes to run/debug on Windows, still produces the Phase 2 outputs (routes map 1:1 to planned modules).
4. Chose local password auth, not OAuth/SMS: PRD age/verification provider is unspecified; local stub unblocks Phase 3 without a paid vendor.
5. Chose local disk over S3: PRD photos are optional; no media processing in MVP.
6. Chose REST over tRPC/GraphQL: simplest contract for an AI agent to implement and test.
7. Realtime: PRD MVP needs only 1-on-1 text — polling/refresh is sufficient. No WebSocket server introduced (avoids over-engineering; can add later for live spaces if needed).
8. Background jobs (expiry of temp states, space auto-close, pause auto-restore, inactivity nudges): Node timers + on-request sweeps locally. No Redis/queue in MVP.
