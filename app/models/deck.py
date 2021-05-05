from .db import db


class Deck(db.Model):
    __tablename__ = "decks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    cards = db.relationship("Card", back_populates="deck")
    owner = db.relationship("User", back_populates="deck")