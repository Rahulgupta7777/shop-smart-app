#!/bin/bash
set -e
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXIT_CODE=0

echo ""
echo ">> Backend tests (SQLite fallback)..."
cd "$PROJECT_ROOT/server"
if npm test; then
  echo "   Backend tests PASSED"
else
  echo "   Backend tests FAILED"
  EXIT_CODE=1
fi

echo ""
echo ">> Frontend tests (Vitest)..."
cd "$PROJECT_ROOT/client"
if npm test -- --run; then
  echo "   Frontend tests PASSED"
else
  echo "   Frontend tests FAILED"
  EXIT_CODE=1
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "All tests passed."
else
  echo "Some tests failed."
fi

exit $EXIT_CODE
