from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/w/<int:id>')
@login_required
def add_win(id):
    user = User.query.get(id)
    user.free_currency += 100
    user.wins += 1
    db.session.commit()
    return user.to_dict()



@user_routes.route('/l/<int:id>')
@login_required
def add_loss(id):
    user = User.query.get(id)
    user.free_currency += 50
    user.losses += 1
    db.session.commit()
    return user.to_dict()