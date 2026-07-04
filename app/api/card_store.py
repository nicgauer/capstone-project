import random

from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import CardType, Card, db

card_store_routes = Blueprint('store', __name__)

BOOSTER_COST = 500
BOOSTER_SIZE = 5

RARITY_COST = {0: 100, 1: 250, 2: 500, 3: 1000, 4: 2000}


def roll_rarity():
    roll = random.randrange(100)
    if roll <= 40:
        return 0
    if roll <= 65:
        return 1
    if roll <= 80:
        return 2
    if roll <= 95:
        return 3
    return 4


@card_store_routes.route('/')
@login_required
def get_cards():
    cards = CardType.query.all()
    return {"cards": [card.to_dict() for card in cards]}


@card_store_routes.route('/boost', methods=['POST'])
@login_required
def buy_booster():
    if current_user.free_currency < BOOSTER_COST:
        return {'errors': ['Insufficient funds']}, 400

    card_types = CardType.query.all()
    by_rarity = {}
    for ct in card_types:
        by_rarity.setdefault(ct.rarity, []).append(ct)

    current_user.free_currency -= BOOSTER_COST
    new_cards = []
    for _ in range(BOOSTER_SIZE):
        ct = random.choice(by_rarity[roll_rarity()])
        new_card = Card(
            user_id=current_user.id,
            card_type=ct.id,
        )
        db.session.add(new_card)
        new_cards.append(new_card)
    db.session.commit()

    return {
        "user": current_user.to_dict(),
        "cards": [card.to_dict() for card in new_cards],
    }


@card_store_routes.route('/buy/<int:card_type_id>', methods=['POST'])
@login_required
def buy_card(card_type_id):
    ct = db.session.get(CardType, card_type_id)
    if ct is None:
        return {'errors': ['Card not found']}, 404
    if ct.rarity is None or ct.rarity not in RARITY_COST:
        return {'errors': ['Card is not purchasable']}, 400

    cost = RARITY_COST[ct.rarity]
    if current_user.free_currency < cost:
        return {'errors': ['Insufficient funds']}, 400

    current_user.free_currency -= cost
    new_card = Card(user_id=current_user.id, card_type=ct.id)
    db.session.add(new_card)
    db.session.commit()

    return {"user": current_user.to_dict(), "card": new_card.to_dict()}
