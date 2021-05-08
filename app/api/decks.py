from flask import Blueprint, jsonify, request 
from flask_login import login_required, current_user
from app.models import Deck, Card, db

deck_routes = Blueprint('deck', __name__)


@deck_routes.route('/u/<int:id>')
@login_required
def get_user_decks(id):
    decks = Deck.query.filter(Deck.user_id == id).all()
    return {"decks": [deck.to_dict() for deck in decks]}


@deck_routes.route('/new/<int:id>')
@login_required
def new_deck(id):
    new_deck = Deck(
        user_id=id,
    )
    db.session.add(new_deck)
    new_card = Card(
        user_id=id,
        deck_id=new_deck.to_dict().id,
        card_type=4
    )
    db.session.add(new_card)
    db.session.commit()
    return new_deck.to_dict()


@deck_routes.route('/<int:card_id>/<int:deck_id>')
@login_required
def add_card_to_deck(card_id, deck_id):
    # deck = Deck.query.filter(Deck.id == deck_id).one()
    card = Card.query.filter(Card.id == card_id).one()
    card.deck_id = deck_id
    db.session.commit()
    return {'success': True}


@deck_routes.route('/remove/<int:card_id>')
@login_required
def remove_from_deck(card_id):
    card = Card.query.filter(Card.id == card_id).one()
    card.deck_id = None
    db.session.commit()
    return {'success': True}
