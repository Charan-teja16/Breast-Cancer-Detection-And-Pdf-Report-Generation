import smtplib
import random
from email.mime.text import MIMEText

def send_otp_email(receiver_email: str) -> str:
    otp = str(random.randint(100000, 999999))

    msg = MIMEText(f"Your OTP code is {otp}")
    msg["Subject"] = "Your Verification OTP"
    msg["From"] = "project.test.g16@gmail.com"
    msg["To"] = receiver_email

    # ✅ Gmail SMTP (enable "App Passwords" in your Gmail account)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login("project.test.g16@gmail.com", "xceo axzb secu rska")
        server.sendmail("project.test.g16@gmail.com", receiver_email, msg.as_string())

    return otp
