from fastapi import APIRouter, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from keras.models import load_model
import numpy as np
from PIL import Image
import io, os
from app.utils.pdf_report import generate_pdf

router = APIRouter()

# Load the trained model
model = load_model('app/models/cancer_model.h5')


@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    username: str = Form(...),
   ):
    contents = await file.read()

    # Process uploaded image
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((50, 50))
    img_array = np.array(image) / 255.0
    img_array = img_array.reshape(1, 50, 50, 3)

    # Model prediction
    prediction = model.predict(img_array)
    result = 1 if prediction[0][0] > 0.5 else 0
    confidence = float(prediction[0][0]) * 100

    # Save uploaded image
    upload_dir = os.path.join("app", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    uploaded_image_path = os.path.join(upload_dir, file.filename)
    with open(uploaded_image_path, "wb") as f:
        f.write(contents)

    # Reports folder (absolute)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # project/app
    project_root = os.path.abspath(os.path.join(base_dir, ".."))            # project/
    report_dir = os.path.join(project_root, "reports")
    os.makedirs(report_dir, exist_ok=True)

    pdf_filename = f"{file.filename}_report.pdf"
    report_path = os.path.join(report_dir, pdf_filename)   # absolute path

    # Generate PDF report (also creates PNG preview)
    report_image_path = generate_pdf(username,result, confidence, uploaded_image_path, report_path)

    # Convert absolute → relative paths for frontend
    report_image_rel = "/reports/" + os.path.basename(report_image_path)

    return {
        "prediction": int(result),
        "confidence": f"{confidence:.2f}%",
        "report": f"/reports/{pdf_filename}",
        "report_image": report_image_rel
    }


# ✅ Force file download endpoint
@router.get("/download-report")
async def download_report(report: str = Query(...)):
    """
    Forces the download of a PDF report instead of opening it in the browser.
    """
    # Clean filename (avoid /reports/ prefix)
    filename = report.replace("/reports/", "").strip()
    report_path = os.path.join("reports", filename)

    if os.path.exists(report_path):
        return FileResponse(
            path=report_path,
            filename="Cancer_Report.pdf",
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=Cancer_Report.pdf"}
        )
    return {"error": "Report not found"}
