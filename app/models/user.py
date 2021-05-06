from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(40), nullable = False, unique = True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  hashed_password = db.Column(db.String(255), nullable = False)
  free_currency = db.Column(db.Integer, default=0)
  paid_currency = db.Column(db.Integer, default=0)
  wins = db.Column(db.Integer, default=0)
  losses = db.Column(db.Integer, default=0)
  cards = db.relationship("Card", back_populates="owner")
  decks = db.relationship("Deck", back_populates="user")


  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)


  def to_dict(self):
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "free_currency": self.free_currency,
      "paid_currency": self.paid_currency,
      "wins": self.wins,
      "losses": self.losses,
    }
