from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import selectinload
from app.models import Friendship, User, db


friendship_routes = Blueprint('friendship', __name__)


@friendship_routes.route('/<int:id>')
@login_required
def get_user_friends(id):
    friends = Friendship.query.options(
        selectinload(Friendship.user1), selectinload(Friendship.user2)
    ).filter(((Friendship.user1_id == id) | (Friendship.user2_id == id))).all()
    return {"friends": [friend.to_dict() for friend in friends]}


@friendship_routes.route('/send/<int:recipient>', methods=['POST'])
@login_required
def send_friend_request(recipient):
    sender = current_user.id
    pendingRequest = Friendship.query.filter((Friendship.user2_id == sender) & (Friendship.user1_id == recipient)).all()

    if len(pendingRequest) > 0:
        pendingRequest[0].confirmed = True
        db.session.commit()
        return pendingRequest[0].to_dict()

    friend = Friendship(
        user1_id=int(sender),
        user2_id=int(recipient),
        confirmed=False,
    )
    db.session.add(friend)
    db.session.commit()
    return friend.to_dict()


@friendship_routes.route('/confirm/<int:id>', methods=['POST'])
@login_required
def confirm_friend_request(id):
    friend = db.session.get(Friendship, id)
    if not friend:
        return {'errors': ['Friend request not found']}, 404
    if friend.user2_id != current_user.id:
        return {'errors': ['Forbidden']}, 403
    friend.confirmed = True
    db.session.commit()
    return friend.to_dict()


@friendship_routes.route('/friendcode', methods=['POST'])
@login_required
def friendcode_add():
    req = request.json
    code = req["code"].split(':')
    try:
        target_id = int(code[1])
    except (IndexError, ValueError):
        return {"error": 'Incorrect friend code'}
    pendingRequest = Friendship.query.filter((Friendship.user2_id == current_user.id) & (Friendship.user1_id == target_id)).all()

    if len(pendingRequest) > 0:
        pendingRequest[0].confirmed = True
        db.session.commit()
        return pendingRequest[0].to_dict()

    target = db.session.get(User, target_id)
    if target:
        if target.username.replace(' ', '-') == code[0]:
            new_request = Friendship(
                user1_id=current_user.id,
                user2_id=target_id,
                confirmed=False
            )
            db.session.add(new_request)
            db.session.commit()
            return new_request.to_dict()
    return {"error": 'Incorrect friend code'}