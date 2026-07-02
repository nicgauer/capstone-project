from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import selectinload
from app.models import Deck, Card, db

deck_routes = Blueprint('deck', __name__)


@deck_routes.route('/u/<int:id>')
# @login_required
def get_user_decks(id):
    decks = Deck.query.options(
        selectinload(Deck.cards).selectinload(Card.ct)
    ).filter(Deck.user_id == id).all()
    return {"decks": [deck.to_dict() for deck in decks]}


@deck_routes.route('/new', methods=['POST'])
@login_required
def new_deck():
    req = request.json
    new_deck = Deck(
        user_id=current_user.id,
        name=req
    )
    db.session.add(new_deck)
    db.session.commit()
    return new_deck.to_dict_lite()


@deck_routes.route('/<int:card_id>/<int:deck_id>', methods=['POST'])
@login_required
def add_card_to_deck(card_id, deck_id):
    card = db.session.get(Card, card_id)
    if not card:
        return {'errors': ['Card not found']}, 404
    if card.user_id != current_user.id:
        return {'errors': ['Forbidden']}, 403
    deck = db.session.get(Deck, deck_id)
    if not deck:
        return {'errors': ['Deck not found']}, 404
    if deck.user_id != current_user.id:
        return {'errors': ['Forbidden']}, 403
    card.deck_id = deck_id
    db.session.commit()
    return {'success': True}


@deck_routes.route('/remove/<int:card_id>', methods=['POST'])
@login_required
def remove_from_deck(card_id):
    card = db.session.get(Card, card_id)
    if not card:
        return {'errors': ['Card not found']}, 404
    if card.user_id != current_user.id:
        return {'errors': ['Forbidden']}, 403
    card.deck_id = None
    db.session.commit()
    return {'success': True}
