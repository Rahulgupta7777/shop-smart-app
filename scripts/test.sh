#!/bin/bash
set -e
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXIT_CODE=0

# Backend tests
echo ""
echo ">> Running backend tests..."
cd "$PROJECT_ROOT/server"
npx prisma generate 2>/dev/null
DATABASE_URL="file:./test.db" npx prisma db push 2>/dev/null
if DATABASE_URL="file:./test.db" npm test; then
    echo "   Backend tests PASSED"
else
    echo "   Backend tests FAILED"
    EXIT_CODE=1
fi
rm -f test.db

# Frontend tests
echo ""
echo ">> Running frontend tests..."
cd "$PROJECT_ROOT/client"
if npm test -- --run; then
    echo "   Frontend tests PASSED"
else
    echo "   Frontend tests FAILED"
    EXIT_CODE=1
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "All tests passed!"
else
    echo "Some tests failed!"
fi

exit $EXIT_CODE
