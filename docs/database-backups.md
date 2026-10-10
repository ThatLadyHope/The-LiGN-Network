# Database backups (local Postgres)

Backups protect live user data against volume loss. Code is safe on GitHub;
data is not — this closes that gap.

## Automatic safety already on
- `docker-compose.yml` sets `restart: unless-stopped`: Docker brings
  Postgres back after restarts instead of leaving it stopped.
- Data lives in the named volume `lign-data`, which survives container
  removal. Never run `docker volume rm` / `compose down -v` casually.

## Backups
- Run `npm run db:backup` (or `powershell scripts/backup-db.ps1`).
  Writes `db/backups/lign-<timestamp>.dump`, keeps the 7 newest.
- `db/backups/` is gitignored — dumps never enter the repo.
- Recommended rhythm: before any risky operation, and weekly otherwise.
  Windows Task Scheduler can run the script on a schedule.

## Restore (disaster: volume lost or corrupted)
1. `docker compose up -d db` (fresh empty database).
2. `npx prisma migrate deploy` (recreate schema).
3. Restore the newest dump:
   `docker cp db/backups/<file> the-lign-network-db-1:/tmp/restore.dump`
   `docker exec the-lign-network-db-1 pg_restore -U postgres -d lign /tmp/restore.dump`
4. Verify: user count matches expectations.

## What backups do NOT cover
- Anything created after the last backup run. Backup before upgrades.
- Production later needs its own managed backups; this covers local dev.
