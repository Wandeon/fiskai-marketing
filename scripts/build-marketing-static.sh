#!/bin/bash
# Build marketing static export
# Simplified script for the standalone marketing repository
set -euo pipefail

# Use GITHUB_WORKSPACE in CI, otherwise find repo root from script location
if [ -n "${GITHUB_WORKSPACE:-}" ]; then
  cd "$GITHUB_WORKSPACE"
else
  cd "$(dirname "$0")/.."
fi

echo "=== Building Marketing Static Export ==="

# Step 1: Clean previous build artifacts
echo "Step 1: Cleaning previous builds..."
rm -rf .next out

# Step 2: Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Step 2: Installing dependencies..."
  npm ci
else
  echo "Step 2: Dependencies already installed"
fi

# Step 3: Run static export build
echo "Step 3: Running static export build..."

if npm run build 2>&1 | tee /tmp/marketing-static-build.log; then
  echo ""
  echo "=== Static Export Build SUCCEEDED ==="
  echo "Output directory: out/"

  # Verify key pages exist
  echo ""
  echo "Verifying key pages..."
  REQUIRED_PAGES=(
    "out/index.html"
    "out/login/index.html"
    "out/register/index.html"
    "out/contact/index.html"
  )

  for page in "${REQUIRED_PAGES[@]}"; do
    if [ -f "$page" ]; then
      echo "  ✓ $page"
    else
      echo "  ✗ MISSING: $page"
      exit 1
    fi
  done

  echo ""
  echo "Build verification passed!"
else
  echo ""
  echo "=== Static Export Build FAILED ==="
  echo "Check /tmp/marketing-static-build.log for details"
  exit 1
fi
