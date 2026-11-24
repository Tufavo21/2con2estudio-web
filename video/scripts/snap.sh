#!/usr/bin/env bash
# uso: scripts/snap.sh <film|film-v> <tiempos>
cd "$(dirname "$0")/.." && source env.sh && cd "$1" && npx hyperframes snapshot --at "$2" --no-end --json 2>&1 | grep -oE '"[^"]*contact-sheet[^"]*.jpg"' | tr -d '"'
