# Deployment Runbook — DigitalOcean Droplet

Production stack: one droplet running Docker Compose with three services —
Caddy (reverse proxy, TLS), the app image (Flask + built React SPA, pulled
from GHCR), and Postgres 16 (data in a named volume). GitHub Actions builds
the image on every push to `master` and SSHes in to pull + restart.

## 1. Create the droplet

- Ubuntu 24.04 LTS, **Basic / Regular, $6/mo (1 GB RAM, 1 vCPU)**. No builds
  happen on the droplet, so 1 GB is plenty (Caddy ~40 MB, app ~120 MB,
  Postgres ~80 MB idle).
- Add your personal SSH key during creation.

Add 1 GB of swap as OOM insurance:

```sh
fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 2. Install Docker and create the deploy user

As root:

```sh
curl -fsSL https://get.docker.com | sh

adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy

# Key used by GitHub Actions (generate locally: ssh-keygen -t ed25519 -f deploy_key)
mkdir -p /home/deploy/.ssh
echo "<deploy_key.pub contents>" >> /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh && chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
```

Harden SSH in `/etc/ssh/sshd_config`: `PermitRootLogin no`,
`PasswordAuthentication no`, then `systemctl restart ssh`.
(Do this only after confirming you can log in as `deploy`.)

## 3. Firewall

```sh
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

## 4. App directory and .env

```sh
mkdir -p /opt/capstone && chown deploy:deploy /opt/capstone
```

As `deploy`, create `/opt/capstone/.env` from [.env.example](../.env.example).
Before a domain exists (IP-only, plain HTTP):

```
DOMAIN=http://<droplet-ip>
APP_ORIGINS=http://<droplet-ip>
SECURE_COOKIES=false
SECRET_KEY=<openssl rand -hex 32>
POSTGRES_PASSWORD=<openssl rand -hex 16>
```

The explicit `http://` prefix in `DOMAIN` tells Caddy to serve plain HTTP and
skip certificate provisioning. `SECURE_COOKIES=false` is required over plain
HTTP or the browser drops the CSRF cookie and login breaks.

## 5. GitHub repository setup

Repo → Settings → Secrets and variables → Actions:

| Secret | Value |
|---|---|
| `DROPLET_HOST` | droplet IP |
| `DROPLET_USER` | `deploy` |
| `DROPLET_SSH_KEY` | contents of the private `deploy_key` |

After the first workflow run pushes the image, make the GHCR package
**public** (github.com → your profile → Packages → capstone-project →
Package settings → Change visibility) so the droplet can pull without
credentials. Alternatively, run a one-time
`docker login ghcr.io -u nicgauer` on the droplet with a classic PAT that has
`read:packages`.

## 6. First deploy

1. Push to `master` (or re-run the Deploy workflow). It builds, pushes to
   GHCR, copies `docker-compose.yml` + `Caddyfile` to `/opt/capstone/`, and
   runs `docker compose pull app && docker compose up -d`.
   Migrations run automatically on container start ([entrypoint.sh](../entrypoint.sh)).
2. Seed once (demo user + card catalog — not idempotent, run only on a fresh DB):

   ```sh
   docker compose -f /opt/capstone/docker-compose.yml exec app flask seed all
   ```

3. Visit `http://<droplet-ip>` — sign up, log in, and start a match to verify
   websockets.

## 7. Domain day

1. Buy the domain, add an A record pointing at the droplet IP (plus `www` if
   wanted — add it to the Caddyfile site address too).
2. Edit three lines in `/opt/capstone/.env`:

   ```
   DOMAIN=example.com
   APP_ORIGINS=https://example.com
   SECURE_COOKIES=true
   ```

3. `cd /opt/capstone && docker compose up -d` — Caddy obtains Let's Encrypt
   certificates automatically and redirects HTTP→HTTPS.

## 8. Backups

Daily Postgres dump via cron (as `deploy`, `crontab -e`):

```
15 4 * * * docker compose -f /opt/capstone/docker-compose.yml exec -T db pg_dump -U app app | gzip > /opt/backups/app-$(date +\%F).sql.gz && find /opt/backups -name 'app-*.sql.gz' -mtime +7 -delete
```

(`mkdir -p /opt/backups` first.) Restore:
`gunzip -c app-<date>.sql.gz | docker compose exec -T db psql -U app app`.

## Operational notes

- **Single worker is mandatory**: matchmaking/game state lives in Python
  process memory (`app/sockets/game_sockets.py`). Never raise gunicorn `-w`
  above 1 without adding a Socket.IO message queue (Redis).
- Logs: `docker compose logs -f app` (or `caddy` / `db`).
- The droplet is deliberately dumb: the only hand-managed file is `.env`.
  Everything else arrives via the deploy workflow.
