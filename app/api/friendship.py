from flask import Blueprint, jsonify, request 
from flask_login import login_required, current_user
from app.models import Friendship, User, db


friendship_routes = Blueprint('friendship', __name__)


@friendship_routes.route('/<int:id>')
@login_required
def get_user_friends(id):
    friends = Friendship.query.filter(((Friendship.user1_id == id) or (Friendship.user2_id == id))).all()
    return {"friends": [friend.to_dict() for friend in friends]}


@friendship_routes.route('/send/<int:sender>/<int:recipient>')
@login_required
def send_friend_request(sender, recipient):
    friend = Friendship(
        user1_id=int(sender),
        user2_id=int(recipient),
        confirmed=False,
    )
    db.session.add(friend)
    db.session.commit()
    return friend.to_dict()


@friendship_routes.route('/confirm/<int:id>')
@login_required
def confirm_friend_request(id):
    friend = Friendship.query.get(id)
    if friend:
        friend.confirmed = True
    db.session.commit()
    return friend.to_dict()
