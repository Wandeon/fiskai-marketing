#!/bin/bash
#
# Deploy fiskai-marketing static site to SiteGround
#
# Usage:
#   ./scripts/deploy-siteground.sh
#
# Prerequisites:
#   - SITEGROUND_HOST, SITEGROUND_USER, SITEGROUND_PASSWORD env vars set
#   - OR: SSH key configured for passwordless auth
#   - lftp installed (brew install lftp / apt install lftp)
#
# This script:
#   1. Builds the static site
#   2. Uploads to SiteGround via SFTP
#   3. Verifies deployment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }
error() { echo -e "${RED}[error]${NC} $1"; exit 1; }

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
OUT_DIR="$PROJECT_ROOT/out"
REMOTE_DIR="public_html"

# Check for required env vars
if [[ -z "${SITEGROUND_HOST:-}" ]]; then
  error "SITEGROUND_HOST not set. Export it or add to .env"
fi

if [[ -z "${SITEGROUND_USER:-}" ]]; then
  error "SITEGROUND_USER not set. Export it or add to .env"
fi

# Password is optional if using SSH keys
USE_PASSWORD=false
if [[ -n "${SITEGROUND_PASSWORD:-}" ]]; then
  USE_PASSWORD=true
fi

# Step 1: Build
log "Building static site..."
cd "$PROJECT_ROOT"

if [[ ! -f "package.json" ]]; then
  error "package.json not found. Are you in the marketing repo?"
fi

npm ci --silent
npm run build

if [[ ! -d "$OUT_DIR" ]]; then
  error "Build failed - out/ directory not found"
fi

PAGE_COUNT=$(find "$OUT_DIR" -name "index.html" | wc -l | tr -d ' ')
log "Built $PAGE_COUNT pages"

if [[ "$PAGE_COUNT" -lt 10 ]]; then
  error "Too few pages built ($PAGE_COUNT). Something went wrong."
fi

# Step 2: Upload
log "Uploading to SiteGround..."

if command -v lftp &> /dev/null; then
  # Use lftp for efficient mirror upload
  if [[ "$USE_PASSWORD" == "true" ]]; then
    lftp -u "$SITEGROUND_USER","$SITEGROUND_PASSWORD" sftp://"$SITEGROUND_HOST" << EOF
set sftp:auto-confirm yes
set net:max-retries 3
set net:reconnect-interval-base 5
mirror -R --delete --verbose "$OUT_DIR" "$REMOTE_DIR"
quit
EOF
  else
    # SSH key auth
    lftp sftp://"$SITEGROUND_USER"@"$SITEGROUND_HOST" << EOF
set sftp:auto-confirm yes
set net:max-retries 3
mirror -R --delete --verbose "$OUT_DIR" "$REMOTE_DIR"
quit
EOF
  fi
elif command -v rsync &> /dev/null; then
  # Fall back to rsync over SSH (requires SSH key)
  warn "lftp not found, using rsync (requires SSH key auth)"
  rsync -avz --delete "$OUT_DIR/" "$SITEGROUND_USER@$SITEGROUND_HOST:~/$REMOTE_DIR/"
else
  error "Neither lftp nor rsync found. Install one: brew install lftp"
fi

# Step 3: Verify
log "Verifying deployment..."

VERIFY_URL="https://www.fiskai.hr/"
HTTP_CODE=$(curl -sL -o /dev/null -w "%{http_code}" "$VERIFY_URL" || echo "000")

if [[ "$HTTP_CODE" == "200" ]]; then
  log "Deployment verified - $VERIFY_URL returned $HTTP_CODE"
else
  warn "Verification returned HTTP $HTTP_CODE - check manually"
fi

# Check redirect pages
for page in login register; do
  REDIRECT_URL="https://www.fiskai.hr/$page/"
  REDIRECT_CODE=$(curl -sL -o /dev/null -w "%{http_code}" "$REDIRECT_URL" || echo "000")
  if [[ "$REDIRECT_CODE" == "200" ]]; then
    log "Redirect page /$page/ verified"
  else
    warn "Redirect page /$page/ returned HTTP $REDIRECT_CODE"
  fi
done

log "Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Verify pages manually: https://www.fiskai.hr/"
echo "  2. Purge SiteGround cache if needed (Site Tools → Speed → Caching)"
echo "  3. Test auth redirects: https://www.fiskai.hr/login/"
