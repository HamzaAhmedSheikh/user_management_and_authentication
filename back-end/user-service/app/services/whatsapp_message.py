from pydantic import ValidationError
import re
from fastapi import Depends, HTTPException
from app.database import get_session
from sqlmodel import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.settings import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models.verification_token import VerificationToken, VerificationTokenType
import hashlib
import requests
from app.settings import WHATSAPP_API_KEY, WHATSAPP_API_URL

# Hash generator
def generate_hash_id(data: str, length=8):
    data_to_hash = data.encode('utf-8')
    hash_object = hashlib.sha256(data_to_hash)
    hash_id = hash_object.hexdigest()[:length]
    return hash_id


def send_whatsapp_message(number: str, message: str):
    api_url = WHATSAPP_API_URL
    payload = {
        "number": number,
        "message": message,
        "apikey": WHATSAPP_API_KEY
    }
    try:
        response = requests.get(api_url, params=payload)
        print(f"WhatsApp API Response: {response.text}")
        response.raise_for_status()
        return {"status": "success", "detail": "Message sent successfully"}
    except requests.exceptions.RequestException as e:
        print(f"Error Sending WhatsApp Message: {e}")
        raise HTTPException(
            status_code=410, detail="Enter a phone number registered with WhatsApp"
        )


async def create_and_send_magic_link(user, phone: str, session: Session = Depends(get_session)):
    expire = datetime.utcnow() + timedelta(minutes=15)
    token_data = {"sub": user.email, "phone": user.phone, "exp": expire}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Generate a hash of the token
    hash_id = generate_hash_id(token)

    # Generate the verification URL
    url = f"http://localhost:3000/verification?token={hash_id}"
    
    # Message to be sent
    sms_message = f"Click the link to verify your phone number:\n {url} \n\nThe link expires in 15 minutes."
    
    # Send the WhatsApp message
    send_whatsapp_message(phone, sms_message)

    # Store the hash in the VerificationToken table only if the message was sent successfully
    verification_token = VerificationToken(
        user_id=user.id,
        hash_id=hash_id,
        token_value=token,
        token_type=VerificationTokenType.EMAIL_VERIFICATION,
        expires_at=expire
    )
    session.add(verification_token)
    session.commit()

    return {"status": "success", "detail": "Verification link sent successfully"}