from fastapi import HTTPException
from sqlmodel import Session
from datetime import datetime, timedelta
from jose import jwt
from app.settings import SECRET_KEY, ALGORITHM, FRONTEND_VERIFICATION_URL
from app.models.verification_token import VerificationToken, VerificationTokenType
import hashlib
from app.models.user import User
from app.services.email_message import send_user_magic_link_email
from app.services.whatsapp_message import send_magic_link_whatsapp


# Function to generate the hash
def generate_hash_id(data: str, length=8):
    data_to_hash = data.encode('utf-8')
    hash_object = hashlib.sha256(data_to_hash)
    hash_id = hash_object.hexdigest()[:length]
    return hash_id


async def create_magic_link(user: User, purpose: VerificationTokenType, session: Session):
    """
    Create a magic link based on the purpose (email verification, phone verification, password reset).
    Args:
      user (User): The user object
      purpose (VerificationTokenType): Purpose of the magic link (email_verification, phone_verification, password_reset)
      session (Session): Database session for storing the token
    Returns:
      Tuple: Magic link and hash_id
    """
    expire = datetime.utcnow() + timedelta(minutes=15)  # Link expiration time
    token_data = {"sub": user.email, "exp": expire, "purpose": str(purpose)}
    # Debugging: Print token_data and its type
    print(token_data, type(token_data))
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Generate a hash of the token
    hash_id = generate_hash_id(token)

    # Generate the verification URL based on the purpose
    base_url = FRONTEND_VERIFICATION_URL
    if purpose == VerificationTokenType.EMAIL_VERIFICATION:
        url = f"{base_url}/verification?token={hash_id}&type=email"
    elif purpose == VerificationTokenType.PHONE_VERIFICATION:
        url = f"{base_url}/verification?token={hash_id}&type=phone"
    elif purpose == VerificationTokenType.PASSWORD_RESET:
        url = f"{base_url}/password?token={hash_id}&type=reset"

    # Store the hash in the VerificationToken table
    verification_token = VerificationToken(
        user_id=user.id,
        hash_id=hash_id,
        token_value=token,
        token_type=purpose,
        expires_at=expire
    )
    try:
        session.add(verification_token)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Failed to save verification token: {e}")
        raise HTTPException(status_code=500, detail="Failed to save verification token.")

    return url, hash_id


# Main function to be used in endpoints for sending link
async def create_and_send_magic_link(
    user: User, 
    session: Session,
    purpose: VerificationTokenType = VerificationTokenType.EMAIL_VERIFICATION  # Set default value here
):
    """
    Create a magic link and send it to the user's email and WhatsApp.
    Args:
      user (User): The user object
      purpose (VerificationTokenType): Purpose of the magic link (default is email_verification)
      session (Session): Database session for storing the token
    """
    # Step 1: Create the magic link
    magic_link, hash_id = await create_magic_link(user, purpose, session)

    # Step 2: Send the magic link via WhatsApp for phone verification
    if purpose == VerificationTokenType.PHONE_VERIFICATION:
        send_magic_link_whatsapp(user.phone, magic_link)

    # Step 3: Send the magic link via Email for email verification or password reset
    if purpose in [VerificationTokenType.EMAIL_VERIFICATION, VerificationTokenType.PASSWORD_RESET]:
        send_user_magic_link_email(user.email, user.full_name, magic_link, purpose)

    return {"status": "success", "detail": f"Verification link for {purpose} sent successfully"}