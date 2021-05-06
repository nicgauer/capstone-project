from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import CardType, Card, User, db

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
    req = request.json
    for card in req['cards']:
        new_card = Card(
            user_id=current_user.id,
            card_type=int(card)
        )
        db.session.add(new_card)
    db.session.commit()
    return {'success': True}


@card_store_routes.route('/boost/fc/<int:id>')
@login_required
def fc_buy_booster(id):
    user = User.query.filter(User.id == id).one()
    user.to_dict()['free_currency'] -= 500
    db.session.commit()
    return user.to_dict()
