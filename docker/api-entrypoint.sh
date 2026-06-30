#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/packages/database
prisma migrate deploy

echo "Starting API..."
cd /app
exec node apps/api/dist/main.js
