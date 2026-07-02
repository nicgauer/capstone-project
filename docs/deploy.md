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
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJvuH7mruK7jeER+mAfzCNfM/O/3jh78hsHwjYcuBox0 nic@Nics-MacBook-Pro.local
" >> /home/deploy/.ssh/authorized_keys
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

## 4. App directory

```sh
mkdir -p /opt/capstone && chown deploy:deploy /opt/capstone
```

`.env` is **not** created by hand — the deploy workflow regenerates it from
GitHub Secrets on every run (see below), so config changes never require SSH.

## 5. DNS

Add an A record for your domain pointing at the droplet IP (plus a `www`
record if you want it — add it to the [Caddyfile](../Caddyfile) site address
too). Caddy requires this to resolve *before* it can provision a Let's
Encrypt certificate, so do this before the first deploy.

## 6. GitHub repository setup

Repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `DROPLET_HOST` | droplet IP |
| `DROPLET_USER` | `deploy` |
| `DROPLET_SSH_KEY` | contents of the private `deploy_key` |
| `DOMAIN` | your domain, e.g. `sbc-tcg.dev` (no `https://`) |
| `SECRET_KEY` | generate with `openssl rand -hex 32` |
| `POSTGRES_PASSWORD` | generate with `openssl rand -hex 16` |

The deploy workflow writes `/opt/capstone/.env` from the last three on every
run: `APP_ORIGINS=https://$DOMAIN` and `SECURE_COOKIES=true` are derived
automatically since we're always deploying against a real domain.

After the first workflow run pushes the image, make the GHCR package
**public** (github.com → your profile → Packages → capstone-project →
Package settings → Change visibility) so the droplet can pull without
credentials. Alternatively, run a one-time
`docker login ghcr.io -u nicgauer` on the droplet with a classic PAT that has
`read:packages`.

## 7. First deploy

1. Push to `master` (or re-run the Deploy workflow). It builds, pushes to
   GHCR, copies `docker-compose.yml` + `Caddyfile` to `/opt/capstone/`,
   writes `.env` from the secrets above, and runs
   `docker compose pull app && docker compose up -d`. Migrations run
   automatically on container start ([entrypoint.sh](../entrypoint.sh)).
2. Seed once (demo user + card catalog — not idempotent, run only on a fresh DB):

   ```sh
   docker compose -f /opt/capstone/docker-compose.yml exec app flask seed all
   ```

3. Visit `https://<your-domain>` — sign up, log in, and start a match to
   verify websockets. First load may take a few seconds while Caddy obtains
   the certificate.

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
- The droplet is deliberately dumb: nothing on it is hand-managed, including
  `.env`. Everything arrives via the deploy workflow, driven by GitHub
  Secrets. Rotating `SECRET_KEY`/`POSTGRES_PASSWORD` or changing `DOMAIN` is
  just updating the secret and re-running the workflow.
