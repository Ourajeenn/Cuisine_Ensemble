#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/cuisineensemble}"
APP_URL="${APP_URL:-http://localhost:3000}"

echo "[post-deploy] Starting post-deployment checks"
docker compose -f "$APP_DIR/docker-compose.CuisineEnsemble.yml" ps
curl -fsS "$APP_URL" >/dev/null
echo "[post-deploy] Smoke test complete"
