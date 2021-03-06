from flask.cli import AppGroup
from .users import seed_users, undo_users
from .card_types import seed_card_types, undo_card_types
from .decks import seed_ai_decks, undo_ai_decks

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_card_types()
    seed_ai_decks()
    # Add other seed functions here

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_card_types()
    undo_ai_decks()
    # Add other undo functions here
