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
    msg.attach(MIMEText(body, 'html'))
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
    
def build_html_email(user_name: str, sender_email: str) -> str:
    return f"""
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to Panaversity - Your Journey into Generative AI and Cloud Computing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          body {{ font-family: "Poppins", sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; color: #333; }}
          .container {{ max-width: 700px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); }}
          .pg-name {{ color: #0070f3; font-weight: 600; }}
          .logo {{ text-align: center; margin-bottom: 30px; }}
          .logo img {{ width: 140px; height: 140px; object-fit: contain; }}
          .greeting {{ font-size: 1.2em; margin-bottom: 20px; }}
          .content {{ line-height: 1.8; margin-bottom: 30px; }}
          .content a {{ color: #0070f3; text-decoration: none; font-weight: 500; }}
          .content a:hover {{ text-decoration: underline; }}
          .footer {{ margin-top: 30px; text-align: center; font-size: 0.9em; color: #555; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://panaversity-website-azure.vercel.app/logo.png" alt="Panaversity Logo" />
          </div>
          <div class="greeting">Dear {user_name},</div>
          <div class="content">
            <p>Welcome to the <strong class="pg-name">Panaversity Generative AI and Cloud Computing Program</strong>!</p>
            <p>We’re thrilled to have you as part of a transformative journey, where innovation meets learning. Panaversity is dedicated to equipping you with industry-leading skills in Generative AI and Cloud Computing, preparing you for future opportunities in the tech world.</p>
            <p>Your registration is confirmed!</p>
            <p>As we prepare to kick off, stay connected for updates about the program schedule, resources, and more.</p>
            <p>Visit our website for the latest updates: <a href="https://panaversity.org" target="_blank">panaversity.org</a>.</p>
            <p>If you have any questions, feel free to reach out to us at <a href="mailto:{sender_email}" target="_blank">{sender_email}</a>.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Panaversity. All rights reserved.</p>
            <p>You're receiving this email because you registered for the Panaversity program.</p>
          </div>
        </div>
      </body>
    </html>
    """

def send_user_signup_email(email: str, name: str):
    subject = "Welcome to Panaversity - Your Journey into Generative AI and Cloud Computing"
    body = build_html_email(name, settings.SMTP_SENDER)
    send_email(email, subject, body)
    return {"msg": "Email sent successfully"}