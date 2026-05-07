# VPS Deployment Guide

This repo is prepared for a simple same-server deployment:

- Next.js frontend on `127.0.0.1:3000`
- Express/Prisma backend on `127.0.0.1:4000`
- Nginx reverse proxy on ports `80` and `443`
- PostgreSQL either on the VPS or from a managed provider

## 1. Install base packages

Ubuntu example:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

Install Node.js 20 or newer before continuing.

## 2. Clone the project

```bash
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
cd /var/www
git clone <your-repo-url> real-estate
cd real-estate
```

## 3. Configure environment files

Backend:

```bash
cp backend/.env.example backend/.env
```

Set at least:

```env
DATABASE_URL=postgresql://...
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_ORIGIN=https://your-domain.com,https://www.your-domain.com
NODE_ENV=production
```

Frontend:

Edit `frontend/.env.production` and set:

```env
NEXT_PUBLIC_API_BASE=
INTERNAL_API_BASE=http://127.0.0.1:4000
NEXT_PUBLIC_SITE_URL=https://your-domain.com
API_PROXY_TARGET=
```

Leave `NEXT_PUBLIC_API_BASE` blank when Nginx proxies `/api/*` on the same domain.

## 4. Install dependencies

```bash
cd /var/www/real-estate/backend
npm ci

cd /var/www/real-estate/frontend
npm ci
```

## 5. Prepare the database

```bash
cd /var/www/real-estate/backend
npx prisma migrate deploy
npx prisma db seed
```

Skip the seed step if the database already contains production data.

## 6. Build the frontend

```bash
cd /var/www/real-estate/backend
npm run build

cd /var/www/real-estate/frontend
npm run build
```

## 7. Install systemd services

Template files are in `deploy/systemd/`.

1. Copy `deploy/systemd/real-estate-backend.service` to `/etc/systemd/system/`
2. Copy `deploy/systemd/real-estate-frontend.service` to `/etc/systemd/system/`
3. Update `User`, `Group`, and `WorkingDirectory` if needed
4. Reload and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now real-estate-backend
sudo systemctl enable --now real-estate-frontend
sudo systemctl status real-estate-backend
sudo systemctl status real-estate-frontend
```

## 8. Install Nginx config

Template file: `deploy/nginx/real-estate.conf`

```bash
sudo cp deploy/nginx/real-estate.conf /etc/nginx/sites-available/real-estate
sudo ln -s /etc/nginx/sites-available/real-estate /etc/nginx/sites-enabled/real-estate
sudo nginx -t
sudo systemctl reload nginx
```

Update `server_name` first.

## 9. Enable HTTPS

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 10. Smoke test

Check these after the services are live:

- `https://your-domain.com`
- `https://your-domain.com/api/health`
- login / register flow
- property listings load on the homepage
- a form submission reaches the backend

## Common notes

- If frontend pages render without API data, verify `INTERNAL_API_BASE` and that the backend service is listening on `127.0.0.1:4000`.
- If browser requests fail with CORS errors, verify `FRONTEND_ORIGIN` in `backend/.env`.
- If Prisma reports connection errors, confirm the `DATABASE_URL` format and network access to PostgreSQL.
