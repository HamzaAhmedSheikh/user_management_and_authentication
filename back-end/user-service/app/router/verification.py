from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.models.user import User, UserCreate, UserType, UserRead
from app.models.auth_token import AuthToken
from app.models.teacher import Teacher
from app.schemas.user import MessageResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.utils.auth import hash_password, get_current_user, authenticate_user, create_access_token
from app.services.whatsapp_message import create_and_send_magic_link
from app.database import get_session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.settings import SECRET_KEY, ALGORITHM
from app.models.verification_token import VerificationToken, VerificationTokenType
from app.services.email_message import send_user_verifies_success_email

verification_router = APIRouter()


@verification_router.get("/verify", response_model=MessageResponse)
async def verify_user(token: str, request: Request, session: Session = Depends(get_session)):
    # Find the verification token by hash
    verification_token = session.exec(
        select(VerificationToken).where(VerificationToken.hash_id == token)
    ).first()

    if not verification_token:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")

    # Check if the token has already been used
    if verification_token.used_at:
        raise HTTPException(status_code=400, detail="Verification link has already been used")

    # Decode the original token to validate expiration and content
    try:
        payload = jwt.decode(verification_token.token_value, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Verification link has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

    # Find the user associated with this verification token
    user: User = session.exec(select(User).where(User.id == verification_token.user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the user is already verified
    if user.is_verified:
        return {"message": "User is already verified"}

    # Verify the user
    user.is_verified = True
    session.add(user)
    session.commit()
    session.refresh(user)
    send_user_verifies_success_email(user.email, user.full_name)
    # Mark the token as used
    verification_token.used_at = datetime.utcnow()
    session.add(verification_token)
    session.commit()
    session.refresh(verification_token)
    return {"message": "User verified successfully"}