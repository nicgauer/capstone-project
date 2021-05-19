from .db import db


class Friendship(db.Model):
    __tablename__ = "friendships"

    id = db.Column(db.Integer, primary_key=True)
    confirmed = db.Column(db.Boolean, default=False)
    user1_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user1 = db.relationship("User", foreign_keys='Friendship.user1_id')
    user2 = db.relationship("User", foreign_keys='Friendship.user2_id')

    def to_dict(self):
        return {
            "id": self.id,
            "confirmed": self.confirmed,
            "user1_id": self.user1_id,
            "user2_id": self.user2_id,
            "user1": self.user1.to_dict(),
            "user2": self.user2.to_dict()
        }