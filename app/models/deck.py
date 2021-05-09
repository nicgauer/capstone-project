from .db import db


class Deck(db.Model):
    __tablename__ = "decks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), default='User Deck')
    cards = db.relationship("Card", back_populates="deck")
    user = db.relationship("User", back_populates="decks")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "cards": list(map(lambda card: card.to_dict(), self.cards))
        }

    def to_dict_lite(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
        }