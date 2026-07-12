#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/cuisineensemble}"

echo "[rollback] Stopping and restarting CuisineEnsemble stacks"
docker compose -f "$APP_DIR/docker-compose.CuisineEnsemble.yml" down || true
docker compose -f "$APP_DIR/docker-compose.monitoring.yml" down || true
docker compose -f "$APP_DIR/docker-compose.CuisineEnsemble.yml" up -d --build
docker compose -f "$APP_DIR/docker-compose.monitoring.yml" up -d --build

echo "[rollback] Rollback complete"
