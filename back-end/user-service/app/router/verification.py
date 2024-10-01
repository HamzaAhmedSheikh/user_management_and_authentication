from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import MessageResponse
from sqlmodel import Session, select
from app.database import get_session
from datetime import datetime
from app.models.user import User
from jose import jwt
from app.settings import SECRET_KEY, ALGORITHM
from app.models.verification_token import VerificationToken
from app.services.email_message import send_user_verifies_success_email

verification_router = APIRouter()


@verification_router.get("/verify", response_model=MessageResponse)
async def verify_user_by_token_hash(token: str, session: Session = Depends(get_session)):
    """
    Verify a user's email address using a verification token.

    This endpoint checks the validity of a verification token stored in the VerificationToken table,
    marks the user as verified, and sends a success email.

    Args:
    - token (str): The hash_id of the verification token.

    Returns:
    - dict: A message response indicating verification success or failure.

    Raises:
    - HTTPException: 400 if the verification link is invalid, expired, or already used.
    - HTTPException: 404 if the user is not found.
    """
    
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
        jwt.decode(verification_token.token_value, SECRET_KEY, algorithms=[ALGORITHM])
        
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