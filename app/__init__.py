import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from flask_socketio import SocketIO
from engineio.payload import Payload

from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.card_store import card_store_routes
from .api.cards import card_routes
from .api.decks import deck_routes
from .api.friendship import friendship_routes

from .seeds import seed_commands

from .config import Config

app = Flask(__name__)

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)

# Comma-separated list of allowed origins, e.g. "https://example.com"
_app_origins = os.environ.get("APP_ORIGINS", "*")
origins = '*' if _app_origins == '*' else _app_origins.split(',')

Payload.max_decode_packets = 50
socketio = SocketIO(app, cors_allowed_origins=origins)
from .sockets import game_sockets

app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(card_store_routes, url_prefix='/api/store')
app.register_blueprint(card_routes, url_prefix='/api/cards')
app.register_blueprint(deck_routes, url_prefix='/api/decks')
app.register_blueprint(friendship_routes, url_prefix='/api/friends')
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app, origins=origins)

# HTTP->HTTPS redirection is handled by the Caddy reverse proxy.
# SECURE_COOKIES must be "false" when serving plain HTTP (e.g. IP-only
# deploys before a domain exists), or the browser drops the CSRF cookie.
SECURE_COOKIES = os.environ.get('SECURE_COOKIES', 'true').lower() in ('true', '1')


@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
                        generate_csrf(),
                        secure=SECURE_COOKIES,
                        samesite='Strict' if SECURE_COOKIES else None,
                        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


if __name__ == '__main__':
    socketio.run(app)