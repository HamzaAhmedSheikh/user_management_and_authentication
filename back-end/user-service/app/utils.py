#utils.py
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import requests
import random
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.settings import WHATSAPP_API_KEY



def send_whatsapp_message(number: str, message: str):
    api_url = "https://chatify.najam.pk/api/v1/sendmessage"
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
        return {"status": "error", "detail": f"Failed to send message: {e}"}

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

otp_storage = {}


def store_otp(identifier: str, otp: str, is_email: bool = False):
    expiry = datetime.utcnow() + timedelta(minutes=5)
    otp_storage[identifier] = {"otp": otp,
                               "expiry": expiry, "is_email": is_email}


def get_otp(identifier: str) -> Optional[Dict[str, any]]:
    otp_record = otp_storage.get(identifier)
    if otp_record and otp_record["expiry"] > datetime.utcnow():
        return otp_record
    return None
