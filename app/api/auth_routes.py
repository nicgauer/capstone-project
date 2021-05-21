from flask import Blueprint, jsonify, session, request
from app.models import User, Deck, Card, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
import random

auth_routes = Blueprint('auth', __name__)

deck_one_cards = [45, 45, 45, 46, 46, 46, 52, 55, 5, 5, 5, 6, 6, 7, 34, 34, 73, 74, 41, 1]
deck_two_cards = [2, 2, 2, 3, 3, 4, 4, 55, 67, 75, 73, 6, 6, 7, 5, 5, 73, 38, 38, 13]
deck_three_cards = [2, 2, 2, 3, 3, 4, 4, 55, 67, 75, 73, 23, 24, 22, 14, 15, 73, 38, 38, 13]
deck_four_cards = [17, 17, 17, 18, 18, 19, 29, 29, 30, 30, 43, 47, 47, 47, 48, 49, 50, 58, 55, 62]

decks = [deck_one_cards, deck_two_cards, deck_three_cards, deck_four_cards]


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f"{field} : {error}")
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    print(request.get_json())
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'], 
            free_currency=1000
        )
        db.session.add(user)
        db.session.commit()
        
        new_deck = Deck(
            user_id=user.to_dict()['id'],
            name=f"{user.to_dict()['username']}'s deck"
        )
        db.session.add(new_deck)
        db.session.commit()

        card_arr = random.choice(decks)
        for card in card_arr:
            new_card = Card(
                user_id=user.to_dict()['id'],
                card_type=card,
                deck_id=new_deck.to_dict_lite()['id'],
            )
            db.session.add(new_card)
            
        db.session.commit()
        
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
