#!/bin/sh
# Copies only the files the live site needs into ./dist for worker publishing.
set -e
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist
cp index.html dist/
cp -R assets dist/
echo "Built dist/ ($(find dist -type f | wc -l) files)"
