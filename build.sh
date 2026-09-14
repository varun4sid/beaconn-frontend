#!/bin/bash

set -e

echo "🧹 Cleaning old build..."
rm -rf dist
mkdir -p dist

echo "⚡ Compiling TypeScript..."
tsc

echo "📁 Copying static assets..."
cp -a public/. dist/

echo "✅ Build complete!"