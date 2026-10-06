# LiGN — Technology Stack
Source: PRD §§1-78 and `docs/IMPLEMENTATION_PLAN_FULL.md` Phases 1-12.

## Local Development Architecture

How the app runs locally:
Next.js 14 App Router (TypeScript) on Node.js 20 LTS. UI + REST API via Route Handlers + realtime gateway in the same process. No separate backend server, no Supabase.

How the database runs locally:
Postgres 16 in Docker. No hosted database needed.
docker compose up -d db

How the application connects to the database:
Prisma 5. DATABASE_URL="postgresql://postgres:dev@localhost:5432/lign"

Where uploaded files are stored:
Cloudflare R2 (S3-compatible) in all envs, including local dev. No local-disk branch.

How authentication works locally:
Better Auth 1.x with email + password, DB-backed sessions in Postgres. Email sending via ZeptoMail (assumed "zetomail" = ZeptoMail by Zoho); without a key, verification links log to console in dev only.

Required environment variables (.env, never committed):
DATABASE_URL="postgresql://postgres:dev@localhost:5432/lign"
BETTER_AUTH_SECRET="dev-only-random-string"
R2_ACCOUNT_ID="" R2_ACCESS_KEY_ID="" R2_SECRET_ACCESS_KEY="" R2_BUCKET="lign-dev" R2_PUBLIC_URL=""
PAYSTACK_SECRET_KEY="" PAYSTACK_PUBLIC_KEY=""
EMAIL_FROM="" ZEPTOMAIL_TOKEN=""

Required local dependencies/services:
Node.js 20 LTS + npm, Docker (for Postgres only). No Supabase, no paid services required to start.

Commands:
npm install
docker compose up -d db
npx prisma migrate dev
npm run dev
App http://localhost:3000, API http://localhost:3000/api/*, realtime on same origin.

## Technology Stack

| Area | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router, React, TypeScript) | Web UI + API + realtime gateway in one codebase |
| Backend runtime | Node.js 20 LTS (inside Next.js) | Single runtime |
| Database | Postgres 16 (Docker locally) | All entities, concurrent chat/spaces/reports, full-text private search |
| ORM | Prisma 5 | Typed access, migrations |
| Authentication | Better Auth 1.x (email + password, DB sessions) | Registration/login, one identity, pause/delete hooks |
| File Storage | Cloudflare R2 (S3-compatible) | Avatars/illustrations, later journal/memory media |
| API layer | REST JSON via Route Handlers | Profiles, requests, messages, spaces, reports |
| Realtime | Socket.io 4 self-hosted (same Node process) | MVP 1-on-1 chat, spaces, listener queue, notifications; no Supabase |
| Email | ZeptoMail API (console fallback in dev) | Verification, safety events, notifications |
| Payments | Paystack API (Phase 10+ only) | Optional subscriptions/premium; MVP core stays free per §72 |
| Testing | Vitest + Testing Library | Unit + route + realtime tests |
| Validation | Zod | Transition guards, input shapes |

## Decisions and Assumptions

1. Postgres everywhere (dev via Docker) replaces SQLite: chosen for full-vision concurrency; one DB from MVP to vision, no migration rewrite.
2. Better Auth replaces custom bcrypt/JWT: less custom security code for the AI agent; sessions stay in Postgres.
3. R2 in all envs: no local-disk divergence; needs a Cloudflare R2 free-tier account even for dev.
4. "zetomail" interpreted as ZeptoMail (Zoho transactional email). Correct me if you meant another provider.
5. Paystack gated to Phase 10+: §72 core connection stays free; no paywall on finding someone to talk to.
6. Realtime in MVP via self-hosted Socket.io: no paid vendor, no Supabase per instruction; polling kept only as fallback.
7. Hosting is local device for now: no deploy platform configured; production host undecided.
