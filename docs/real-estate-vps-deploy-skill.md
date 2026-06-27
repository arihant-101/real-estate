# Real Estate VPS Deploy Skill Blueprint

Use this document to create a Codex skill that can access the VPS, pull the latest code from the known deployment branch, preserve environment files, rebuild backend/frontend, redeploy systemd services, and verify the site.

Do not put the VPS password or API keys directly inside the tracked skill files. Put them in a private local env file loaded by the deploy script. This repo now ignores `.real-estate-vps-deploy.env` and `*.secrets.env` so the private file is less likely to be committed.

## Suggested Skill Folder

```text
real-estate-vps-deploy/
├── SKILL.md
├── .real-estate-vps-deploy.env   # private, do not commit
└── scripts/
    └── deploy-real-estate-vps.sh
```

## Private Credentials File

Create this file beside the skill folder or in the repo root as `.real-estate-vps-deploy.env`. Fill in the actual values that were shared privately.

```bash
# SSH access
VPS_HOST=77.68.98.132
VPS_USER=root
SSHPASS='PUT_VPS_PASSWORD_HERE'

# Deployment target
BRANCH=footer-ui-sync-20260506-232150
REPO_URL=https://github.com/arihant-101/real-estate.git
LIVE_DIR=/var/www/real-estate

# Optional backend mail env sync. Leave disabled for normal deploys because live envs are preserved.
SYNC_BACKEND_MAIL_ENV=0
RESEND_API_KEY='PUT_RESEND_API_KEY_HERE'
MAIL_FROM='ASTA Property Management <hello@astapropertymanagement.co.uk>'
SITE_URL=https://www.astapropertymanagement.co.uk
```

Load it when running the script:

```bash
REAL_ESTATE_DEPLOY_ENV=.real-estate-vps-deploy.env scripts/deploy-real-estate-vps.sh
```

## `SKILL.md`

```markdown
---
name: real-estate-vps-deploy
description: Deploy the ASTA real estate app to the production VPS. Use when the user asks to connect to the VPS, pull latest code, redeploy, check deployment status, verify backend/frontend services, preserve production env files, or run production health checks for the real estate project.
---

# Real Estate VPS Deploy

Deploy the production real estate app on the VPS using the established zero-build-live workflow: build in a staging directory, preserve live env files, then swap only after successful backend and frontend builds.

## Production Facts

- VPS: `root@77.68.98.132`
- Live app directory: `/var/www/real-estate`
- Git repo: `https://github.com/arihant-101/real-estate.git`
- Deployment branch: `footer-ui-sync-20260506-232150`
- Backend directory: `/var/www/real-estate/backend`
- Frontend directory: `/var/www/real-estate/frontend`
- Backend service: `real-estate-backend.service`
- Frontend service: `real-estate-frontend.service`
- Backend port: `4000`
- Frontend port: `3000`
- Backend health check: `http://127.0.0.1:4000/api/health`
- Local frontend check: `http://127.0.0.1:3000/`
- Public site check: `https://astapropertymanagement.co.uk/`

## Safety Rules

- Do not print secrets, passwords, `.env` contents, API keys, JWT secrets, or database passwords in final answers.
- Load credentials from a private `.real-estate-vps-deploy.env` file if present; never ask the user to paste secrets into a final answer.
- Preserve all live env files:
  - `/var/www/real-estate/backend/.env*`
  - `/var/www/real-estate/frontend/.env*`
- Only modify backend mail env values when the user explicitly asks or when `SYNC_BACKEND_MAIL_ENV=1` is set.
- Do not run migrations unless the user explicitly asks.
- Do not delete old backups during normal deploys.
- Do not swap the live directory until backend install, Prisma client generation, backend syntax check, frontend install, and frontend build all pass.
- If build or verification fails before the swap, leave the live app untouched and report the failure.
- If verification fails after the swap, inspect service logs and either fix forward or restore the timestamped backup.
- Use absolute paths in VPS commands.

## Normal Deploy Workflow

1. SSH into the VPS.
2. Fetch the deployment branch from GitHub.
3. Record current live commit and remote commit.
4. Clone the deployment branch into `/var/www/real-estate.deploy-<timestamp>`.
5. Copy backend and frontend `.env*` files from the live app into the staging clone.
6. In backend:
   - Run `npm ci`.
   - Run `npm run db:generate`.
   - Run `node --check src/index.js`.
7. In frontend:
   - Run `npm ci`.
   - If `package.json` contains `@next/swc-darwin-arm64`, remove that package entry and run `npm install` instead.
   - Run `npm run build`.
8. Ensure the backend systemd override starts `src/index.js` with `PORT=4000`.
9. Stop frontend, then backend.
10. Move the live app to `/var/www/real-estate.backup-<timestamp>`.
11. Move the staging clone to `/var/www/real-estate`.
12. Start backend and verify `/api/health`.
13. Start frontend and verify local/public HTTP `200`.
14. Report branch, commit, services, health checks, and backup path.

## Preferred Script

Use `scripts/deploy-real-estate-vps.sh` from this skill when available.

Run from the local machine:

```bash
scripts/deploy-real-estate-vps.sh
```

Optional overrides:

```bash
VPS_HOST=77.68.98.132 \
VPS_USER=root \
BRANCH=footer-ui-sync-20260506-232150 \
scripts/deploy-real-estate-vps.sh
```

If password auth is required and `sshpass` is installed, the caller may set `SSHPASS` outside the skill:

```bash
SSHPASS='temporary-password-here' scripts/deploy-real-estate-vps.sh
```

Or put `SSHPASS` in the private `.real-estate-vps-deploy.env` file and run:

```bash
REAL_ESTATE_DEPLOY_ENV=.real-estate-vps-deploy.env scripts/deploy-real-estate-vps.sh
```

Prefer SSH keys when possible.

## Manual Verification Commands

Use these after deployment if extra confirmation is requested:

```bash
ssh root@77.68.98.132 'cd /var/www/real-estate && git branch --show-current && git rev-parse HEAD'
ssh root@77.68.98.132 'systemctl is-active real-estate-backend.service && systemctl is-active real-estate-frontend.service'
ssh root@77.68.98.132 'curl -fsS --max-time 10 http://127.0.0.1:4000/api/health'
ssh root@77.68.98.132 'curl -fsSI --max-time 10 http://127.0.0.1:3000/ | head -1'
ssh root@77.68.98.132 'curl -fsSIk --max-time 10 https://astapropertymanagement.co.uk/ | head -1'
```

## Final Response Format

Keep the final concise. Include:

- Branch deployed
- Commit deployed
- Backend service status
- Frontend service status
- Backend health result
- Local frontend HTTP status
- Public site HTTP status
- Backup path
- Any warnings, such as npm audit notices or build warnings

Never include secrets or full `.env` content.
```

## `scripts/deploy-real-estate-vps.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${REAL_ESTATE_DEPLOY_ENV:-.real-estate-vps-deploy.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

VPS_HOST="${VPS_HOST:-77.68.98.132}"
VPS_USER="${VPS_USER:-root}"
BRANCH="${BRANCH:-footer-ui-sync-20260506-232150}"
REPO_URL="${REPO_URL:-https://github.com/arihant-101/real-estate.git}"
LIVE_DIR="${LIVE_DIR:-/var/www/real-estate}"
SYNC_BACKEND_MAIL_ENV="${SYNC_BACKEND_MAIL_ENV:-0}"

SSH_BASE=(ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_HOST}")

if [[ -n "${SSHPASS:-}" ]]; then
  if ! command -v sshpass >/dev/null 2>&1; then
    echo "SSHPASS is set, but sshpass is not installed locally." >&2
    exit 1
  fi
  SSH_BASE=(sshpass -e ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_HOST}")
fi

"${SSH_BASE[@]}" "bash -lc 'set -euo pipefail
BRANCH=\"${BRANCH}\"
REPO_URL=\"${REPO_URL}\"
LIVE_DIR=\"${LIVE_DIR}\"
SYNC_BACKEND_MAIL_ENV=\"${SYNC_BACKEND_MAIL_ENV}\"
RESEND_API_KEY=\"${RESEND_API_KEY:-}\"
MAIL_FROM=\"${MAIL_FROM:-}\"
SITE_URL=\"${SITE_URL:-}\"
TS=\$(date +%Y%m%d%H%M%S)
DEPLOY_DIR=/var/www/real-estate.deploy-\$TS
BACKUP_DIR=/var/www/real-estate.backup-\$TS

echo \"Fetching branch: \$BRANCH\"
git config --global --add safe.directory \"\$LIVE_DIR\" || true
CURRENT=\$(git -C \"\$LIVE_DIR\" rev-parse HEAD)
git -C \"\$LIVE_DIR\" fetch origin \"\$BRANCH\"
REMOTE=\$(git -C \"\$LIVE_DIR\" rev-parse FETCH_HEAD)
echo \"Current: \$CURRENT\"
echo \"Remote:  \$REMOTE\"

git clone --branch \"\$BRANCH\" --single-branch \"\$REPO_URL\" \"\$DEPLOY_DIR\"

for f in \"\$LIVE_DIR/backend\"/.env*; do
  [ -f \"\$f\" ] && cp -a \"\$f\" \"\$DEPLOY_DIR/backend/\"
done

if [ \"\$SYNC_BACKEND_MAIL_ENV\" = \"1\" ]; then
  : \"\${RESEND_API_KEY:?RESEND_API_KEY is required when SYNC_BACKEND_MAIL_ENV=1}\"
  : \"\${MAIL_FROM:?MAIL_FROM is required when SYNC_BACKEND_MAIL_ENV=1}\"
  : \"\${SITE_URL:?SITE_URL is required when SYNC_BACKEND_MAIL_ENV=1}\"
  export RESEND_API_KEY MAIL_FROM SITE_URL
  node --input-type=module -e \"import fs from 'node:fs';
const path = '\$DEPLOY_DIR/backend/.env';
const updates = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  SITE_URL: process.env.SITE_URL
};
let body = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
for (const [key, value] of Object.entries(updates)) {
  const line = key + '=' + JSON.stringify(value);
  const re = new RegExp('^' + key + '=.*$', 'm');
  body = re.test(body) ? body.replace(re, line) : body.replace(/\\s*$/, '') + '\\n' + line + '\\n';
}
fs.writeFileSync(path, body);\"
fi

for f in \"\$LIVE_DIR/frontend\"/.env*; do
  [ -f \"\$f\" ] && cp -a \"\$f\" \"\$DEPLOY_DIR/frontend/\"
done

cd \"\$DEPLOY_DIR/backend\"
npm ci
npm run db:generate
node --check src/index.js

cd \"\$DEPLOY_DIR/frontend\"
if grep -q \"\\\"@next/swc-darwin-arm64\\\"\" package.json; then
  npm pkg delete dependencies.@next/swc-darwin-arm64
  npm install
else
  npm ci
fi
npm run build

mkdir -p /etc/systemd/system/real-estate-backend.service.d
printf \"%s\\n\" \
  \"[Service]\" \
  \"ExecStart=\" \
  \"ExecStart=/usr/bin/node src/index.js\" \
  \"Environment=PORT=4000\" \
  > /etc/systemd/system/real-estate-backend.service.d/override.conf
systemctl daemon-reload

chown -R www-data:www-data \"\$DEPLOY_DIR\"
systemctl stop real-estate-frontend.service
systemctl stop real-estate-backend.service
mv \"\$LIVE_DIR\" \"\$BACKUP_DIR\"
mv \"\$DEPLOY_DIR\" \"\$LIVE_DIR\"

systemctl start real-estate-backend.service
sleep 3
BACKEND_HEALTH=\$(curl -fsS --max-time 10 http://127.0.0.1:4000/api/health)

systemctl start real-estate-frontend.service
sleep 5
LOCAL_FRONTEND=\$(curl -fsSI --max-time 10 http://127.0.0.1:3000/ | head -1)
PUBLIC_SITE=\$(curl -fsSIk --max-time 10 https://astapropertymanagement.co.uk/ | head -1)

cd \"\$LIVE_DIR\"
echo \"Branch: \$(git branch --show-current)\"
echo \"Commit: \$(git rev-parse HEAD)\"
echo \"Backend: \$(systemctl is-active real-estate-backend.service)\"
echo \"Frontend: \$(systemctl is-active real-estate-frontend.service)\"
echo \"Backend health: \$BACKEND_HEALTH\"
echo \"Local frontend: \$LOCAL_FRONTEND\"
echo \"Public site: \$PUBLIC_SITE\"
echo \"Backup: \$BACKUP_DIR\"
'"
```

## Skill Creation Command

If using Codex's skill init helper, create the skill like this, then replace the generated contents with the files above:

```bash
scripts/init_skill.py real-estate-vps-deploy \
  --path "${CODEX_HOME:-$HOME/.codex}/skills" \
  --resources scripts
```

After adding the files, validate:

```bash
scripts/quick_validate.py "${CODEX_HOME:-$HOME/.codex}/skills/real-estate-vps-deploy"
```

## Example User Prompts That Should Trigger The Skill

- "Connect to the VPS, pull latest, and redeploy."
- "Redeploy the real estate app and keep the envs."
- "Check what branch and commit are live on the VPS."
- "Pull `footer-ui-sync-20260506-232150` and restart backend/frontend."
- "Verify the backend and frontend are running after deployment."
