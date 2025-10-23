from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import crud, database
from app.utils.otp import send_otp_email  # ✅ new function to send OTP via email

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Temporary store info before OTP verified
temp_users = {}
otp_db = {}

# ✅ Schemas
class UserRegister(BaseModel):
    username: str
    password: str
    email: str   # ✅ changed from phone → email

class OTPVerify(BaseModel):
    email: str   # ✅ changed from phone → email
    otp: str

class UserLogin(BaseModel):
    username: str
    password: str


# ✅ Register → Send OTP to Email
@router.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already used.")

    temp_users[user.email] = {
        "username": user.username,
        "password": user.password,
        "email": user.email
    }
    otp = send_otp_email(user.email)   # ✅ send OTP to email
    otp_db[user.email] = otp
    return {"message": "OTP sent to your email."}


# ✅ Verify OTP
@router.post("/verify-otp")
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    stored_otp = otp_db.get(data.email)
    if not stored_otp or stored_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    user_info = temp_users.pop(data.email, None)
    if not user_info:
        raise HTTPException(status_code=400, detail="No pending registration for this email.")

    crud.create_user(db, user_info["username"], user_info["password"], user_info["email"])
    crud.verify_user_email(db, user_info["email"])
    return {"message": "Email verified and user registered successfully."}


# ✅ Login
@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = crud.authenticate_user(db, user.username, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Invalid username, password, or not verified.")
    return {
        "message": "Login successful!",
        "username": authenticated_user.username,
        "email": authenticated_user.email   # ✅ return email instead of phone
    }
