#!/usr/bin/env bash
set -euo pipefail
CONF=/etc/nginx/sites-enabled/real-estate
cp "$CONF" "/root/$(basename "$CONF").bak-lcp-$(date +%Y%m%d%H%M%S)"
python3 <<'PY'
from pathlib import Path
path = Path("/etc/nginx/sites-enabled/real-estate")
text = path.read_text()
if "location /images/" in text:
    print("nginx cache blocks already present")
else:
    insert = """
    location /images/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /videos/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
"""
    marker = "    location /_next/static/ {"
    text = text.replace(marker, insert + "\n" + marker, 1)
    old_static = """    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }"""
    new_static = """    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }"""
    text = text.replace(old_static, new_static, 1)
    path.write_text(text)
    print("nginx config updated")
PY
nginx -t
systemctl reload nginx
echo nginx reloaded
