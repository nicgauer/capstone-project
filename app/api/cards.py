from flask import Blueprint, jsonify, request 
from flask_login import login_required, current_user
from app.models import Card

card_routes = Blueprint('cards', __name__)


@card_routes.route('/<int:id>')
@login_required
def get_user_cards(id):
    cards = Card.query.filter(Card.user_id == id).all()
    return {"cards": [card.to_dict() for card in cards]}