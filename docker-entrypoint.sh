#!/bin/sh
set -e

echo "Entrypoint: waiting for Postgres at $POSTGRES_URL"
# Basic wait loop (pg_isready requires postgresql-client)
MAX_ATTEMPTS=30
ATTEMPT=1
while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  if pg_isready -d "$POSTGRES_URL" >/dev/null 2>&1; then
    echo "Postgres is ready"
    break
  fi
  echo "Postgres not ready yet (attempt $ATTEMPT/$MAX_ATTEMPTS)"
  ATTEMPT=$((ATTEMPT+1))
  sleep 1
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
  echo "Postgres not reachable after $MAX_ATTEMPTS attempts" >&2
  exit 1
fi

echo "Applying schema (idempotent)"
node runtime-schema.js || {
  echo "Schema application failed" >&2
  exit 1
}

echo "Starting standalone Next.js server"
exec node server.js
