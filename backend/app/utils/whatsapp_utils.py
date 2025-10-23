from twilio.rest import Client

# Twilio Credentials (from your Twilio Console)
ACCOUNT_SID = ''
AUTH_TOKEN = ''
TWILIO_WHATSAPP = ""  # Twilio sandbox number

def send_whatsapp_report(phone: str, report_url: str):
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)

        message = client.messages.create(
            body="📑 Here is your Breast Cancer Prediction Report",
            from_=TWILIO_WHATSAPP,
            to=f"whatsapp:{phone}",   # must be verified with sandbox
            media_url=[f"https://xxxxxxxxxx.ngrok-free.app{report_url}"]    # ✅ must be a public URL
        )

        return {"status": "success", "message": "✅ WhatsApp report sent", "sid": message.sid}
    except Exception as e:
        return {"status": "error", "message": f"❌ Failed: {str(e)}"}

