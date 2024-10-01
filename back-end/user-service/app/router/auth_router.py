import random
from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import hash_password
from app.models.user import User
from sqlmodel import Session, select
from app.database import get_session
from app.services.whatsapp_message import send_whatsapp_message
from app.schemas.user import MessageResponse
from app.services.email_message import send_otp_email

auth_router = APIRouter()

@auth_router.post("/request-otp", response_model=MessageResponse)
async def request_otp(email: str, session: Session = Depends(get_session)):
    user: User = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found with this email")

    otp = str(random.randint(100000, 999999)) 
    user.otp = otp 
    session.add(user)
    session.commit()
    
    send_otp_email(user.email, otp)

    return {"message": "OTP sent successfully"}

@auth_router.post("/verify-otp-update-password", response_model=MessageResponse)
async def verify_otp_and_update_password(email: str, otp: str, new_password: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found with this email")
    
    if user.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.password = hash_password(new_password)
    user.otp = None 
    session.add(user)
    session.commit()

    return {"message": "Password updated successfully"}
