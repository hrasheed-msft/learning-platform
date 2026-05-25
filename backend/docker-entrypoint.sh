#!/bin/sh
set -eu

echo "Applying Prisma migrations..."
npx --no-install prisma migrate deploy

echo "Starting application..."
exec "$@"
