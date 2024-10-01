from fastapi import HTTPException
import hashlib
import requests
from app.settings import WHATSAPP_API_KEY, WHATSAPP_API_URL

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


# Function to send WhatsApp message
def send_magic_link_whatsapp(phone: str, magic_link: str):
    """
    Send a WhatsApp message containing the magic link.
    Args:
      phone (str): The phone number to send the message to
      magic_link (str): The magic link to be included in the message
    """
    message = f"Click the link to verify your phone number:\n{magic_link} \n\nThe link expires in 15 minutes."
    send_whatsapp_message(phone, message)
    return {"message": "WhatsApp message sent successfully"}