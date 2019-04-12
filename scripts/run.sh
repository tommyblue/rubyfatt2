#!/bin/sh

set -eu

cd "$(dirname "${0}")/../"

mix deps.get

# Wait for Postgres to become available.
until psql -h db -U "postgres" -c '\q' 2>/dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "\nPostgres is available: continuing with database setup..."

# Potentially Set up the database
mix ecto.create
mix ecto.migrate

# Build frontend
# cd frontend && yarn install && yarn run webpack -p && cd ..

echo "\n Launching Phoenix web server..."
mix phx.server
