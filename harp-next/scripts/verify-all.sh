#!/usr/bin/env bash
# Full regression run: static checks, unit tests, then browser verification in reference and HARP modes.
set -u
cd "$(dirname "$0")/.."
fail=0
step() { echo; echo "=== $1"; }
step "typecheck";  pnpm exec tsc --noEmit && echo ok || fail=1
step "eslint";     pnpm exec eslint . && echo ok || fail=1
step "unit tests"; pnpm exec vitest run 2>&1 | grep -E "Tests|Test Files|FAIL" || fail=1
step "REFERENCE mode (visual comparison build)"
scripts/serve.sh reference 3100
for s in verify-home-interactions verify-about verify-capabilities verify-careers verify-contact verify-newsroom verify-animations; do
  echo "--- $s"; python3 scripts/$s.py | grep -E "FAIL|passed|^[0-9]+ / [0-9]+" || fail=1
done
echo "--- verify-legal-404 (reference)"; python3 scripts/verify-legal-404.py reference | grep -E "FAIL|^[0-9]+ / [0-9]+"
step "HARP mode (default build)"
scripts/serve.sh harp 3100
python3 scripts/verify-harp-mode.py | grep -E "FAIL|problems"
echo "--- verify-legal-404 (harp)"; python3 scripts/verify-legal-404.py harp | grep -E "FAIL|^[0-9]+ / [0-9]+"
exit $fail
