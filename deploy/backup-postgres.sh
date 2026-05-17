#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/dashboard-business}"
DATABASE_NAME="${DATABASE_NAME:-business}"
DATABASE_USER="${DATABASE_USER:-postgres}"
DATABASE_HOST="${DATABASE_HOST:-localhost}"
DATABASE_PORT="${DATABASE_PORT:-5432}"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

timestamp="$(date +%Y%m%d-%H%M%S)"
target="$BACKUP_DIR/${DATABASE_NAME}-${timestamp}.dump"

pg_dump \
  --format=custom \
  --host="$DATABASE_HOST" \
  --port="$DATABASE_PORT" \
  --username="$DATABASE_USER" \
  --file="$target" \
  "$DATABASE_NAME"

find "$BACKUP_DIR" -type f -name "${DATABASE_NAME}-*.dump" -mtime +"$KEEP_DAYS" -delete

echo "Backup created: $target"
