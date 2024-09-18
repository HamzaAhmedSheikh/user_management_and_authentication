from typing import Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.models.user import User, UserCreate, UserType, UserRead, UserUpdate, UserLogin
from app.models.auth_token import AuthToken
from app.models.teacher import Teacher
from app.schemas.user import LoginRequest, TokenResponse, MessageResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.utils.auth import hash_password, get_current_user, authenticate_user, create_access_token
from app.services.whatsapp_message import create_and_send_magic_link
from app.database import get_session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.settings import SECRET_KEY, ALGORITHM
from app.models.verification_token import VerificationToken, VerificationTokenType
from app.services.email_message import send_user_signup_email, send_user_magic_link_email

user_router = APIRouter()


@user_router.post("/register", response_model=UserRead)
async def register_user(new_user: UserCreate, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(
        (User.email == new_user.email) | (User.phone == new_user.phone)
    )).first()
    
    if db_user:
        raise HTTPException(
            status_code=409, detail="User with these credentials already exists")

    user = User(
        full_name=new_user.full_name,
        email=new_user.email,
        phone=new_user.phone,
        affiliation=new_user.affiliation,
        is_verified=False,
        password=hash_password(new_user.password),
        user_type=new_user.user_type
    )

    if new_user.user_type == UserType.TEACHER:
        teacher = Teacher(user_id=user.id, department="Unassigned")
        session.add(teacher)
        session.commit()

    # Use the helper function to create and send the magic link
    await create_and_send_magic_link(user, new_user.phone, session)
    send_user_signup_email(user.email, user.full_name)
    
    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@user_router.post("/login", response_model=TokenResponse)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends(OAuth2PasswordRequestForm)],
    session: Session = Depends(get_session)
):
    # username is an email here
    user = authenticate_user(session, form_data.username, form_data.password)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

#resend link
@user_router.post("/resend-link", response_model=MessageResponse)
async def resend_verification_link(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if user.is_verified:
        raise HTTPException(status_code=400, detail="User is already verified")

    # Use the helper function to create and send the magic link
    await create_and_send_magic_link(user, user.phone, session)
    return {"message": "Verification link resent successfully"}

# logout 
@user_router.post("/logout", response_model=MessageResponse)
async def logout_user(access_token: str, refresh_token: Optional[str] = None):
    return {"message": "Logout successful. The token has been invalidated."}


# profile section
@user_router.patch("/profile", response_model=MessageResponse)
async def update_user_profile(profile_data: UserUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    updates = profile_data.dict(exclude_unset=True)  # Exclude unset fields
    for key, value in updates.items():
        setattr(current_user, key, value)
    session.add(current_user)
    session.commit()
    return {"message": "Profile updated successfully."}


@user_router.get("/profile", response_model=UserRead)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@user_router.get("/admin", response_model=UserRead)
async def get_admin_profile(current_user: User = Depends(get_current_user)):
    if current_user.user_type != UserType.ADMIN:
        raise HTTPException(status_code=403, detail="You are not authorized to access this resource")
    return current_user