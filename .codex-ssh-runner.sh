#!/usr/bin/env bash
set -euo pipefail
ASKPASS="$1"
chmod 700 "$ASKPASS"
DISPLAY=:0 SSH_ASKPASS="$ASKPASS" SSH_ASKPASS_REQUIRE=force setsid ssh \
  -o PreferredAuthentications=password \
  -o PubkeyAuthentication=no \
  -o StrictHostKeyChecking=accept-new \
  root@77.68.98.132 \
  "cd /var/www/real-estate/backend && npm ci && cd /var/www/real-estate/frontend && npm ci" \
  < /dev/null