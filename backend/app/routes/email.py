from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import os

router = APIRouter()

SENDER_EMAIL = ""
SENDER_PASSWORD = "" 
@router.post("/send-email")
async def send_email(data: dict, background_tasks: BackgroundTasks):
    recipient = data.get("email")
    report_path = data.get("report")

    if not recipient or not report_path:
        return JSONResponse({"message": "Missing email or report"}, status_code=400)

    # Convert relative path to actual file system path
    report_full_path = os.path.join(os.getcwd(), report_path.lstrip("/"))

    def send_mail_task():
        try:
            msg = MIMEMultipart()
            msg["From"] = SENDER_EMAIL
            msg["To"] = recipient
            msg["Subject"] = "Breast Cancer Detection Report"

            msg.attach(MIMEText("Please find attached your cancer detection report."))

            with open(report_full_path, "rb") as f:
                mime = MIMEBase("application", "pdf")
                mime.set_payload(f.read())
                encoders.encode_base64(mime)
                mime.add_header("Content-Disposition", "attachment", filename=os.path.basename(report_full_path))
                msg.attach(mime)

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            server.quit()
        except Exception as e:
            print("Email error:", e)

    background_tasks.add_task(send_mail_task)
    return {"message": f"📧 Report sent to {recipient}"}

