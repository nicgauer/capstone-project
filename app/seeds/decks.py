from app.models import db, Card, Deck
from app.utils import decks

# deck_one_cards = [45, 45, 45, 46, 46, 46, 52, 55, 5, 5, 5, 6, 6, 7, 34, 34, 73, 74, 41, 1]
# deck_two_cards = [2, 2, 2, 3, 3, 4, 4, 55, 67, 75, 73, 6, 6, 7, 5, 5, 73, 38, 38, 13]
# deck_three_cards = [2, 2, 2, 3, 3, 4, 4, 55, 67, 75, 73, 23, 24, 22, 14, 15, 73, 38, 38, 13]
# deck_four_cards = [17, 17, 17, 18, 18, 19, 29, 29, 30, 30, 43, 47, 47, 47, 48, 49, 50, 58, 55, 62]
# deck_five_cards = [25, 25, 25, 26, 26, 27, 29, 29, 30, 30, 43, 47, 47, 47, 48, 49, 50, 58, 70, 65]
# deck_six_cards = [45, 45, 45, 46, 46, 46, 52, 55, 5, 5, 5, 6, 6, 7, 61, 61, 61, 69, 40, 1]
# deck_seven_cards = [10, 10, 10, 11, 11, 12, 52, 55, 17, 17, 17, 18, 18, 19, 61, 61, 61, 69, 40, 20]

# decks = [deck_one_cards, deck_two_cards, deck_three_cards, deck_four_cards, deck_five_cards, deck_six_cards, deck_seven_cards]


def seed_ai_decks():
    for d in decks:
        new_deck = Deck(
            user_id=1,
            name='Default Deck',
        )
        db.session.add(new_deck)
        db.session.commit()
        for card in d:
            new_card = Card(
                user_id=1,
                card_type=card,
                deck_id=new_deck.to_dict()['id']
            )
            db.session.add(new_card)
        db.session.commit()


def undo_ai_decks():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()