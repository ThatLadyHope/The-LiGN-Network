#Requires -Version 5.1
# LiGN database backup: pg_dump of the local Postgres into db/backups/.
# Usage: npm run db:backup
# Restore: see docs/database-backups.md
$ErrorActionPreference = "Stop"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dir = Join-Path (Split-Path $PSScriptRoot -Parent) "db\backups"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$out = Join-Path $dir "lign-$stamp.dump"
docker compose --progress quiet exec -T db pg_dump -U postgres -d lign -Fc -f /tmp/backup.dump
docker cp the-lign-network-db-1:/tmp/backup.dump $out
docker exec the-lign-network-db-1 rm /tmp/backup.dump
# Keep the 7 newest backups.
Get-ChildItem $dir -Filter "lign-*.dump" | Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 7 | Remove-Item -Force
Write-Output "Backup written: $out"
