from flask import Blueprint, jsonify, request 
from flask_login import login_required, current_user
from app.models import Friendship, User, db


friendship_routes = Blueprint('friendship', __name__)


@friendship_routes.route('/<int:id>')
@login_required
def get_user_friends(id):
    friends = Friendship.query.filter(((Friendship.user1_id == id) | (Friendship.user2_id == id))).all()
    return {"friends": [friend.to_dict() for friend in friends]}


@friendship_routes.route('/send/<int:sender>/<int:recipient>')
@login_required
def send_friend_request(sender, recipient):
    pendingRequest = Friendship.query.filter((Friendship.user2_id == sender) & (Friendship.user1_id == recipient)).all()

    if pendingRequest:
        pendingRequest.confirmed = True
        db.session.commit()
        return pendingRequest.to_dict()

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


@friendship_routes.route('/friendcode', methods=['POST'])
@login_required
def friendcode_add():
    req = request.json
    code = req.split(':')
    target = User.get(code[1])
    if target:
        if target.username == code[0]:
            new_request = Friendship(
                user1_id=int(req['sender']),
                user2_id=int(code[1]),
                confirmed=False
            )
            db.session.add(new_request)
            db.session.commit()
            return new_request.to_dict()
    return {"error": 'Incorrect friend code'}