# Super Battle Cards

A tongue-in-cheek online trading card game: build decks, battle other
players in realtime (or an AI), manage friends, and buy cards in the store.

**Stack:** Flask 3 + Flask-SocketIO + PostgreSQL backend, React (CRA) + Redux
frontend, all shipped as a single Docker image — Flask serves the built SPA,
the `/api/*` routes, and the Socket.IO game traffic on one port.

## Run it locally (Docker, mirrors production)

```bash
cp .env.example .env          # defaults work for localhost
docker compose up --build -d
docker compose exec app flask seed all   # once, on a fresh database
```

Visit http://localhost — log in as `demo@aa.io` / `password`, or sign up.

## Local development (hot reload)

Backend (needs a local Postgres and a `.env`/exported `DATABASE_URL` +
`SECRET_KEY`):

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
flask db upgrade && flask seed all
flask run
```

Frontend (proxies API calls to Flask on :5000):

```bash
cd react-app
npm install
npm start
```

## Deployment

Pushes to `master` trigger the [Deploy workflow](.github/workflows/deploy.yml):
build image → push to GHCR → SSH to the droplet → pull + restart.
Server provisioning and operations are documented in [docs/deploy.md](docs/deploy.md).

## Architecture notes

- Matchmaking and in-game state live in process memory
  (`app/sockets/game_sockets.py`), so gunicorn **must run a single worker**
  (`-w 1`). Adding workers requires a Socket.IO message queue (Redis).
- Game design docs and the websocket protocol live in [plans/](plans/).
