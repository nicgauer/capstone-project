from .db import db


class Card(db.Model):
    __tablename__ = "cards"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey("decks.id"))
    owner = db.relationship("User", back_populates="cards")
    deck = db.relationship("Deck", back_populates="cards")

    def to_dict(self):
        return{
            "id": self.id,
            "user_id": self.user_id,
            "deck_id": self.deck_id,
            "owner": self.owner.to_dict(),
        }