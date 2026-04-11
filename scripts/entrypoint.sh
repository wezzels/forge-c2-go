#!/bin/sh
# FORGE-C2 Entrypoint Script

set -e

# Log startup
echo "Starting FORGE-C2..."
echo "Version: ${VERSION:-dev}"
echo "Mode: ${FORGE_MODE:-serve}"

# Wait for dependencies (Kafka, etc.)
wait_for_deps() {
    echo "Checking dependencies..."
    # TODO: Add health checks for Kafka, database, etc.
}

# Apply database migrations (if any)
run_migrations() {
    echo "Running migrations..."
    # TODO: Add migration logic
}

# Start the application
start_app() {
    echo "Starting application..."
    exec dumb-init "$@"
}

# Handle signals for graceful shutdown
handle_signal() {
    echo "Received signal, shutting down gracefully..."
    # Send SIGTERM to the process
    kill -TERM 1
}

trap handle_signal SIGTERM SIGINT

# Main
case "$1" in
    serve)
        wait_for_deps
        run_migrations
        start_app /app/forge-c2 serve
        ;;
    worker)
        wait_for_deps
        start_app /app/forge-c2 worker
        ;;
    *)
        exec /app/forge-c2 "$@"
        ;;
esac
