# LiGN — Technology Stack
Source: PRD §§1-78 and `docs/IMPLEMENTATION_PLAN_FULL.md` Phases 1-12.

## Local Development Architecture

How the app runs locally:
Next.js 14 App Router (TypeScript) on Node.js 20 LTS. UI + REST API via Route Handlers + realtime gateway in the same process. No separate backend server.

How the database runs locally:
Postgres 16 in Docker. No hosted database needed.
docker compose up -d db

How the application connects to the database:
Prisma 5. Pooled URL for the app, direct URL for migrations (Supabase).

Where uploaded files are stored:
Supabase Storage (S3-compatible) in all envs. No local-disk branch, no R2.

How authentication works locally:
Clerk 6.x hosted identity (email + code). LiGN profile + agreement records stay in Postgres, keyed by Clerk id. Supabase Auth is NOT used.

Required environment variables (.env, never committed):
DATABASE_URL="supabase-pooled-url"
DIRECT_URL="supabase-direct-url"
BETTER_AUTH_SECRET="dev-only-random-string"
SUPABASE_URL="" SUPABASE_ANON_KEY="" SUPABASE_SERVICE_KEY=""
SUPABASE_PUBLIC_BUCKET="lign-public" SUPABASE_PRIVATE_BUCKET="lign-private"
PAYSTACK_SECRET_KEY="" PAYSTACK_PUBLIC_KEY=""
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="" CLERK_SECRET_KEY=""

Required local dependencies/services:
Node.js 20 LTS + npm. Docker needed only for the offline Postgres fallback. No paid services required to start.

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
| Database | Supabase Postgres (hosted; Docker Postgres offline fallback) | All entities, concurrent chat/spaces/reports, full-text private search |
| ORM | Prisma 5 | Typed access, migrations |
| Authentication | Clerk 6.x (hosted identity, email + code) | Signup/login/reset, verification mail included; LiGN profile stays in Postgres, one per Clerk id |
| File Storage | Supabase Storage (S3-compatible) | Avatars/illustrations, later journal/memory media |
| API layer | REST JSON via Route Handlers | Profiles, requests, messages, spaces, reports |
| Realtime | Socket.io 4 self-hosted (same Node process) | MVP 1-on-1 chat, spaces, listener queue, notifications |
| Email | Clerk built-in (verification, reset) | Auth mail needs no separate provider |
| Payments | Paystack API (Phase 10+ only) | Optional subscriptions/premium; MVP core stays free per §72 |
| Testing | Vitest + Testing Library | Unit + route + realtime tests |
| Validation | Zod | Transition guards, input shapes |

## Decisions and Assumptions

1. Supabase Postgres replaces Docker Postgres as primary: same PostgreSQL the schema was built for, so no model changes and no migration rewrite; Docker stays as offline fallback.
2. Clerk owns identity (incl. all auth mail); LiGN owns profile, agreement history, and sessions of record. Supabase Auth not adopted.
3. Supabase Storage replaces Cloudflare R2: one vendor for data + files; S3-compatible so storage code repoints rather than rewrites.
4. Auth email is Clerk built-in; no separate provider, no keys to manage for auth mail.
5. Paystack gated to Phase 10+: §72 core connection stays free; no paywall on finding someone to talk to.
6. Realtime in MVP via self-hosted Socket.io: no paid vendor; polling kept only as fallback.
7. Hosting is local device for now: no deploy platform configured; production host undecided.
