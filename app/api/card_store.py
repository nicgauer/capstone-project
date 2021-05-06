from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import CardType, Card, db

card_store_routes = Blueprint('store', __name__)


@card_store_routes.route('/')
@login_required
def get_cards():
    cards = CardType.query.all()
    return {"cards": [card.to_dict() for card in cards]}


@card_store_routes.route('/newcard/<int:id>')
@login_required
def new_card(id):
    new_card = Card(
        user_id=current_user.id,
        card_type=id,
    )
    db.session.add(new_card)
    db.session.commit()
    return new_card.to_dict()


@card_store_routes.route('/boost', methods=['POST'])
@login_required
def booster_pack():
    cards = request.json
    for card in cards:
        new_card = Card(
            user_id=current_user.id,
            card_type=card
        )
        db.session.add(new_card)
    db.session.commit()