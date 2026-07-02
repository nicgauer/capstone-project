#!/bin/sh
set -e

flask db upgrade

# Game/matchmaking state lives in module-level dicts (app/sockets/game_sockets.py),
# so this MUST stay a single worker unless a Socket.IO message queue is added.
# Socket.IO runs in threading mode; simple-websocket provides WebSocket support.
exec gunicorn -w 1 --threads 50 --bind 0.0.0.0:8000 app:app
