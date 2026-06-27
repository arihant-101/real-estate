#!/usr/bin/env bash
# Loads .real-estate-vps-deploy.env and runs deploy/deploy-vps.sh via sshpass.
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${REAL_ESTATE_DEPLOY_ENV:-$REPO_ROOT/.real-estate-vps-deploy.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [[ -z "${SSHPASS:-}" ]]; then
  echo "SSHPASS is required in $ENV_FILE" >&2
  exit 1
fi

WRAP="/tmp/ssh-sshpass-wrap-$$"
mkdir -p "$WRAP"
cat > "$WRAP/ssh" <<'EOF'
#!/bin/bash
exec sshpass -e /usr/bin/ssh "$@"
EOF
chmod +x "$WRAP/ssh"
export PATH="$WRAP:$PATH"

export VPS="${VPS_USER:-root}@${VPS_HOST:-77.68.98.132}"
cd "$REPO_ROOT"
sed -i 's/\r$//' deploy/deploy-vps.sh 2>/dev/null || true
bash deploy/deploy-vps.sh
