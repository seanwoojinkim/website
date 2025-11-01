#!/bin/bash
# Development server startup script

echo "🚀 Starting development server..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start server
npm start
