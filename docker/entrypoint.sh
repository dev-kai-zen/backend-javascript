#!/bin/sh
set -e

# Usage:
#   - Default: start API only (production-style). Migrations run only if
#     RUN_MIGRATIONS_ON_START=true (optional local convenience).
#   - migrate: run Sequelize CLI once, then exit — use for explicit deploy steps:
#       docker compose run --rm api migrate
# Run CLI via Node so we do not depend on `.bin/` shims (portable inside slim images).
SEQL_CLI="node ./node_modules/sequelize-cli/lib/sequelize"

run_migrations_with_retries() {
  echo "Running database migrations..."
  i=0
  while [ "$i" -lt 10 ]; do
    if $SEQL_CLI db:migrate; then
      return 0
    fi
    i=$((i + 1))
    if [ "$i" -eq 10 ]; then
      echo "sequelize-cli db:migrate failed after 10 attempts."
      return 1
    fi
    echo "Migrate not ready yet, retrying in 3s ($i/10)..."
    sleep 3
  done
}

if [ "$1" = "migrate" ]; then
  shift
  exec node ./node_modules/sequelize-cli/lib/sequelize db:migrate "$@"
fi

if [ "$1" = "run" ]; then
  shift
fi

if [ "${RUN_MIGRATIONS_ON_START}" = "true" ]; then
  run_migrations_with_retries
fi

exec node src/index.js
