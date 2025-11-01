#!/bin/bash
set -e

# Fix permissions on volumes
if [ "$(id -u)" = "0" ]; then
    echo "Fixing permissions for non-root user..."
    chown -R node:node /home/node /workspace 2>/dev/null || true
    exec gosu node "$@"
else
    exec "$@"
fi
