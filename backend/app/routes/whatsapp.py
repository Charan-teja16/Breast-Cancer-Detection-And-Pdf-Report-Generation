from fastapi import APIRouter
from pydantic import BaseModel
from app.utils.whatsapp_utils import send_whatsapp_report

router = APIRouter()

class WhatsAppRequest(BaseModel):
    phone: str
    report: str  # example: "/reports/report_xyz.pdf"

@router.post("/send-whatsapp")
def send_whatsapp(data: WhatsAppRequest):
    # Convert relative path → absolute public URL
    return send_whatsapp_report(data.phone, data.report)
