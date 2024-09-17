from email.mime.multipart import MIMEMultipart
from fastapi import HTTPException
import smtplib
import ssl
from email.mime.text import MIMEText
from app import settings

def send_email(email, subject, body):
    smtp_server = settings.SMTP_SERVER
    smtp_port = settings.SMTP_PORT
    smtp_user = settings.SMTP_USER
    smtp_password = settings.SMTP_PASSWORD
    smpt_sender = settings.SMTP_SENDER

    msg = MIMEMultipart()
    msg['From'] = smpt_sender
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    context = ssl.create_default_context()

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, email, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")
    
def send_user_signup_email(email: str, name: str):
    subject = "Welcome to our platform!"
    body = f"Thank you {name} for signing up for our platform. We are excited to have you on board!"
    send_email(email, subject, body)
    return {"msg": "Email sent successfully"}