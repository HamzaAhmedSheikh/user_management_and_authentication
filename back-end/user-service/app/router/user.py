# #router/user.py

from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import Register_User, Token, User, Teacher, UserType
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.auth import hash_password, get_current_user, authenticate_user, create_access_token
from app.db_engine import get_session
from app.utils import generate_otp, get_otp, send_whatsapp_message, store_otp, otp_storage

user_router = APIRouter(
    prefix="/user",
    tags=["Students"]
)


@user_router.post("/register", response_model=dict)
async def register_user(new_user: Register_User, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(
        (User.email == new_user.email) | (User.phone == new_user.phone)
    )).first()

    if db_user:
        raise HTTPException(
            status_code=409, detail="User with these credentials already exists"
        )

    otp = generate_otp()
    store_otp(new_user.phone, otp)

    message = f"Your OTP for registration is {otp}. It is valid for 5 minutes."
    whatsapp_response = send_whatsapp_message(new_user.phone, message)
    if whatsapp_response["status"] != "success":
        raise HTTPException(
            status_code=500, detail="Failed to send WhatsApp message"
        )

    otp_storage[new_user.phone] = {
        "otp": otp,
        "expiry": datetime.utcnow() + timedelta(minutes=5),
        "user_data": new_user.dict()
    }
    print(f"Stored user data: {otp_storage[new_user.phone]}")

    return {"status": "success", "detail": "OTP sent to WhatsApp"}


@user_router.post("/verify_otp")
async def verify_otp(phone: str, otp: str, session: Session = Depends(get_session)):
    otp_record = get_otp(phone)
    if not otp_record or otp_record["otp"] != otp:
        raise HTTPException(
            status_code=400, detail="Invalid or expired OTP and Number fornt is 923xxxxxxxxx"
        )

    user_data = otp_record.get("user_data")
    if not user_data:
        print(f"No user data found for phone {phone}")
        raise HTTPException(
            status_code=400, detail="No user data found"
        )

    user = User(
        full_name=user_data['full_name'],
        email=user_data['email'],
        phone=user_data['phone'],
        affiliation=user_data['affiliation'],
        is_verified=True,
        password=hash_password(user_data['password']),
        user_type=user_data['user_type']
    )

    db_user = session.exec(select(User).where(
        (User.email == user.email) | (User.phone == user.phone)
    )).first()

    if db_user:
        raise HTTPException(
            status_code=409, detail="User with these credentials already exists"
        )

    session.add(user)
    session.commit()
    session.refresh(user)

    if user.user_type == UserType.TEACHER:
        teacher = Teacher(user_id=user.id, department="Unassigned")
        session.add(teacher)
        session.commit()

    del otp_storage[phone]

    if user.phone:
        whatsapp_response = send_whatsapp_message(
            user.phone, f"Welcome {user.full_name} to Panaversity!")
        if whatsapp_response["status"] != "success":
            raise HTTPException(
                status_code=500, detail="Failed to send WhatsApp message"
            )

    return {"status": "success", "detail": "OTP verified successfully, user registered"}


@user_router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@user_router.post("/logout")
async def logout_user(access_token: str, refresh_token: Optional[str] = None):
    return {"status": "success", "message": "Logout successful. The token has been invalidated."}


@user_router.patch("/profile")
async def update_user_profile(profile_data: dict, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    for key, value in profile_data.items():
        setattr(current_user, key, value)
    session.add(current_user)
    session.commit()
    return {"status": "success", "message": "Profile updated successfully."}


@user_router.get("/profile", response_model=User)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@user_router.delete("/delete_account")
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    session.delete(current_user)
    session.commit()

    return {"status": "success", "message": "Your account has been deleted successfully."}
 