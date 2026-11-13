#!/usr/bin/env bash
# Rebuild and (re)start the production server for local verification.  Usage: scripts/serve.sh [reference|harp] [port]
set -e
cd "$(dirname "$0")/.."
SRC=${1:-harp}; PORT=${2:-3100}
for pid in $(ps -eo pid,args | grep -E "next-server|next start" | grep -v grep | grep -v serve.sh | awk '{print $1}'); do kill "$pid" 2>/dev/null || true; done
sleep 1
CONTENT_SOURCE=$SRC NEXT_TELEMETRY_DISABLED=1 pnpm exec next build 2>&1 | grep -E "rror|Compiled|✓ Gen" || true
CONTENT_SOURCE=$SRC setsid nohup pnpm exec next start -p "$PORT" > /tmp/next.log 2>&1 &
sleep 4; curl -s -o /dev/null -w "server %{http_code} (content=$SRC)\n" "http://localhost:$PORT/"
