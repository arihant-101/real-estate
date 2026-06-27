#!/usr/bin/env bash

set -Eeuo pipefail

VPS="${VPS:-root@77.68.98.132}"
BRANCH="${BRANCH:-footer-ui-sync-20260506-232150}"
REPO_URL="${REPO_URL:-https://github.com/arihant-101/real-estate.git}"
SITE_URL="${SITE_URL:-https://astapropertymanagement.co.uk/}"

echo "Deploying $BRANCH from $REPO_URL to $VPS"
echo "SSH may prompt for the VPS password."

ssh -o StrictHostKeyChecking=accept-new "$VPS" bash -s -- \
  "$BRANCH" "$REPO_URL" "$SITE_URL" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

BRANCH="$1"
REPO_URL="$2"
SITE_URL="$3"
LIVE_DIR="/var/www/real-estate"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
DEPLOY_DIR="/var/www/real-estate.deploy-$TIMESTAMP"
BACKUP_DIR="/var/www/real-estate.backup-$TIMESTAMP"
FAILED_DIR="/var/www/real-estate.failed-$TIMESTAMP"
SWAPPED=0

rollback() {
  local status=$?

  if [[ "$SWAPPED" -eq 1 ]]; then
    echo "Deployment failed after cutover. Rolling back..."
    systemctl stop real-estate-frontend.service || true
    systemctl stop real-estate-backend.service || true

    if [[ -d "$LIVE_DIR" ]]; then
      mv "$LIVE_DIR" "$FAILED_DIR"
    fi
    if [[ -d "$BACKUP_DIR" ]]; then
      mv "$BACKUP_DIR" "$LIVE_DIR"
    fi

    systemctl start real-estate-backend.service || true
    systemctl start real-estate-frontend.service || true
    echo "Rollback completed. Failed release: $FAILED_DIR"
  else
    echo "Deployment failed before cutover; the live app was not changed."
  fi

  exit "$status"
}
trap rollback ERR

if [[ "$(id -u)" -ne 0 ]]; then
  echo "This deployment must run as root on the VPS." >&2
  exit 1
fi

for command in git npm node curl systemctl; do
  command -v "$command" >/dev/null
done

test -f "$LIVE_DIR/backend/.env"
test -f "$LIVE_DIR/frontend/.env.production"

echo "Current release:"
git config --global --add safe.directory "$LIVE_DIR"
git -C "$LIVE_DIR" branch --show-current
git -C "$LIVE_DIR" rev-parse HEAD

echo "Cloning $BRANCH into $DEPLOY_DIR..."
git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$DEPLOY_DIR"

echo "Preserving production environment files..."
cp -a "$LIVE_DIR/backend/.env" "$DEPLOY_DIR/backend/.env"
cp -a "$LIVE_DIR/frontend/.env.production" \
  "$DEPLOY_DIR/frontend/.env.production"

echo "Preparing backend..."
cd "$DEPLOY_DIR/backend"
npm ci
npm run db:generate
node --check src/index.js

echo "Building frontend..."
cd "$DEPLOY_DIR/frontend"
if grep -q '"@next/swc-darwin-arm64"' package.json; then
  echo "Removing macOS-only SWC dependency for the Linux VPS..."
  npm pkg delete dependencies.@next/swc-darwin-arm64
  npm install
else
  npm ci
fi
npm run build

echo "Preparing systemd configuration..."
mkdir -p /etc/systemd/system/real-estate-backend.service.d
printf '%s\n' \
  '[Service]' \
  'ExecStart=' \
  'ExecStart=/usr/bin/node src/index.js' \
  'Environment=PORT=4000' \
  > /etc/systemd/system/real-estate-backend.service.d/override.conf
systemctl daemon-reload
chown -R www-data:www-data "$DEPLOY_DIR"

echo "Switching releases..."
systemctl stop real-estate-frontend.service
systemctl stop real-estate-backend.service
mv "$LIVE_DIR" "$BACKUP_DIR"
mv "$DEPLOY_DIR" "$LIVE_DIR"
SWAPPED=1

echo "Starting and checking backend..."
systemctl start real-estate-backend.service
sleep 3
curl --fail --silent --show-error --max-time 10 \
  http://127.0.0.1:4000/api/health
echo

echo "Starting and checking frontend..."
systemctl start real-estate-frontend.service
sleep 5
curl --fail --silent --show-error --head --max-time 10 \
  http://127.0.0.1:3000/ >/dev/null
curl --fail --silent --show-error --head --max-time 10 \
  "$SITE_URL" >/dev/null

systemctl is-active --quiet real-estate-backend.service
systemctl is-active --quiet real-estate-frontend.service

SWAPPED=0
trap - ERR

git config --global --add safe.directory "$LIVE_DIR"
echo "Deployment successful."
echo "Branch: $(git -C "$LIVE_DIR" branch --show-current)"
echo "Commit: $(git -C "$LIVE_DIR" rev-parse HEAD)"
echo "Backup: $BACKUP_DIR"
echo "Site: $SITE_URL"
REMOTE_SCRIPT
