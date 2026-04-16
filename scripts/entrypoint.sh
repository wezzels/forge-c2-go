#!/bin/sh
set -e

# FORGE-C2 entrypoint script

echo "FORGE-C2 starting..."
echo "Version: ${FORGE_C2_VERSION:-dev}"
echo "Mode: ${FORGE_C2_MODE:-serve}"

# Handle signals via dumb-init
exec /app/forge-c2 -mode "${FORGE_C2_MODE:-serve}" "$@"