
# # router/auth_router.py
import random
from fastapi import APIRouter, Depends, HTTPException
from app.auth import get_current_user, hash_password
from app.models import User
from sqlmodel import Session, select
from app.db_engine import get_session
from app.utils import send_whatsapp_message

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@auth_router.post("/request-otp")
async def request_otp(phone: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.phone == phone)).first()
    if not user:
        raise HTTPException(
            status_code=404, detail="User not found with this phone number")

    otp = str(random.randint(100000, 999999))
    user.otp = otp
    session.add(user)
    session.commit()

    send_whatsapp_message(phone, f"Your OTP is {otp}")

    return {"status": "success", "message": "OTP sent successfully"}


@auth_router.post("/verify-otp-update-password")
async def verify_otp_and_update_password(phone: str, otp: str, new_password: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.phone == phone)).first()
    if not user:
        raise HTTPException(
            status_code=404, detail="User not found with this phone number")

    if user.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.password = hash_password(new_password)
    user.otp = None
    session.add(user)
    session.commit()

    return {"status": "success", "message": "Password updated successfully"}
