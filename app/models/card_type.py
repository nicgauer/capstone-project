from .db import db


class CardType(db.Model):
    __tablename__ = 'card_types'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(150), nullable = False, unique = True)
    type = db.Column(db.String(50), nullable = False)
    attack = db.Column(db.Integer)
    defense = db.Column(db.Integer)
    description = db.Column(db.String(255), nullable = False)
    effect = db.Column(db.String(100))
    rarity = db.Column(db.Integer)
    picture_url = db.Column(db.String(255))
    evolution_name = db.Column(db.String(150))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "attack": self.attack,
            "defense": self.defense,
            "description": self.description,
            "effect": self.effect,
            "evolution_name": self.evolution_name,
            "rarity": self.rarity,
            "picture_url": self.picture_url,
        }