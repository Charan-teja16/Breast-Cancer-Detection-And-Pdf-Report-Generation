from sqlalchemy.orm import Session
from werkzeug.security import check_password_hash
from . import models

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return None
    if not user.is_verified:   # ✅ only allow verified users
        return None
    if not user.password==password:
        return None
    return user

def create_user(db: Session, username: str, password: str, email: str):
    db_user = models.User(username=username, password=password, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def verify_user_email(db: Session, email: str):
    user = get_user_by_email(db, email)
    if user:
        user.is_verified = True
        db.commit()
        db.refresh(user)
        return user
    return None
