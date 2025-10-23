from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from datetime import datetime
from PIL import Image as PILImage
from pdf2image import convert_from_path
import os

def generate_pdf(username, prediction, confidence, image_path, report_path):
    # Ensure reports directory exists
    report_dir = os.path.dirname(report_path)
    os.makedirs(report_dir, exist_ok=True)

    c = canvas.Canvas(report_path, pagesize=letter)
    width, height = letter
    
    # Set up dimensions
    margin = 40
    content_width = width - (2 * margin)
    
    # Color scheme - only black except for result
    black = colors.HexColor("#000000")
    success_color = colors.HexColor("#388E3C")  # Green for benign
    warning_color = colors.HexColor("#D32F2F")  # Red for malignant
    light_gray = colors.HexColor("#F5F5F5")
    
    # Clean white background
    c.setFillColor(colors.white)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    
    # Enhanced header with medical symbols
    header_height = 85
    
    # Light gray background for header
    c.setFillColor(light_gray)
    c.rect(0, height - header_height, width, header_height, fill=1, stroke=0)
    
    # Draw medical symbols
    c.setStrokeColor(black)
    c.setLineWidth(1)
    
    # Draw DNA helix symbol on left
    helix_x = margin + 30
    helix_y = height - 40
    helix_radius = 4
    for i in range(5):
        y_offset = i * 8 - 16
        # Left side of helix
        c.circle(helix_x - helix_radius, helix_y + y_offset, helix_radius, stroke=1, fill=0)
        # Right side of helix
        c.circle(helix_x + helix_radius, helix_y - y_offset, helix_radius, stroke=1, fill=0)
        # Connecting lines
        if i < 4:
            c.line(helix_x - helix_radius, helix_y + y_offset, helix_x + helix_radius, helix_y - y_offset + 8)
    
    # Draw medical cross symbol on right
    cross_size = 12
    cross_x = width - margin - 30
    cross_y = height - 40
    
    # Vertical line of cross
    c.line(cross_x, cross_y - cross_size, cross_x, cross_y + cross_size)
    # Horizontal line of cross
    c.line(cross_x - cross_size, cross_y, cross_x + cross_size, cross_y)
    
    # Title
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width / 2, height - 35, "BREAST CANCER DIAGNOSTIC REPORT")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(width / 2, height - 58, "AI-Powered Medical Imaging Analysis")
    
    # Decorative line under header
    c.setStrokeColor(black)
    c.setLineWidth(0.5)
    c.line(margin, height - header_height, width - margin, height - header_height)
    
    # Patient information section
    info_y = height - 100
    c.setFillColor(colors.white)
    c.setStrokeColor(black)
    c.setLineWidth(0.5)
    c.rect(margin, info_y - 60, content_width, 55, fill=0, stroke=1)
    
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(margin + 15, info_y - 25, "PATIENT INFORMATION")
    
    c.setFont("Helvetica", 10)
    c.drawString(margin + 15, info_y - 40, f"Patient: {username}")
    c.drawString(margin + content_width/2, info_y - 40, f"Date: {datetime.now().strftime('%Y-%m-%d')}")
    c.drawString(margin + 15, info_y - 55, f"Time: {datetime.now().strftime('%H:%M')}")
    c.drawString(margin + content_width/2, info_y - 55, f"Report ID: BCD-{datetime.now().strftime('%Y%m%d%H%M')}")
    
    # Diagnosis result - only colored element
    result_y = info_y - 80
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, result_y, "DIAGNOSIS")
    
    # Result with appropriate color (only colored text in the document)
    if prediction == 0:
        result_text = "BENIGN - NO MALIGNANCY DETECTED"
        result_color = success_color
    else:
        result_text = "MALIGNANT - INVASIVE DUCTAL CARCINOMA DETECTED"
        result_color = warning_color
    
    c.setFillColor(result_color)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, result_y - 28, result_text)
    
    # Confidence level in black
    c.setFillColor(black)
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, result_y - 52, f"Confidence: {confidence:.1f}%")
    
    # Image section
    image_y = result_y - 75
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, image_y, "ANALYZED IMAGE")
    
    # Process and add image
    grayscale_path = os.path.join(report_dir, "grayscale_temp.png")
    img = PILImage.open(image_path).convert('L')
    img.save(grayscale_path)
    
    img_reader = ImageReader(grayscale_path)
    img_width, img_height = 170, 170
    img_x = (width - img_width) / 2
    img_y = image_y - img_height - 15
    
    # Draw image without border
    c.drawImage(img_reader, img_x, img_y, width=img_width, height=img_height)
    
    # Findings section
    findings_y = img_y - 40
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, findings_y, "FINDINGS")
    
    c.setFont("Helvetica", 10)
    
    if prediction == 0:
        findings = [
            "• Tissue architecture appears within normal limits",
            "• No evidence of abnormal cell proliferation",
            "• Regular cellular patterns observed",
            "• No characteristics suggestive of malignancy"
        ]
    else:
        findings = [
            "• Irregular tissue architecture identified",
            "• Abnormal cell clusters consistent with IDC",
            "• Disorganized cellular patterns observed",
            "• Features suggestive of invasive ductal carcinoma"
        ]
    
    # Draw findings
    for i, finding in enumerate(findings):
        c.drawString(margin + 15, findings_y - 22 - (i * 18), finding)
    
    # Recommendations section
    rec_y = findings_y - 105
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, rec_y, "RECOMMENDATIONS")
    
    c.setFont("Helvetica", 10)
    
    if prediction == 0:
        recommendations = [
            "• Continue with routine screening as recommended",
            "• No additional imaging required at this time",
            "• Follow standard screening guidelines"
        ]
    else:
        recommendations = [
            "• Consultation with oncology specialist recommended",
            "• Biopsy for definitive diagnosis advised",
            "• Further diagnostic imaging may be necessary"
        ]
    
    # Draw recommendations
    for i, recommendation in enumerate(recommendations):
        c.drawString(margin + 15, rec_y - 22 - (i * 18), recommendation)
    
    # Footer
    footer_y = 55
    c.setStrokeColor(black)
    c.setLineWidth(0.5)
    c.line(margin, footer_y + 18, width - margin, footer_y + 18)
    
    c.setFillColor(black)
    c.setFont("Helvetica-Oblique", 8)
    c.drawCentredString(width / 2, footer_y + 3, "This AI-assisted report should be reviewed by a qualified healthcare professional.")
    c.drawCentredString(width / 2, footer_y - 12, "Confidential medical document - For authorized use only")
    
    c.save()

    # Clean up temporary file
    if os.path.exists(grayscale_path):
        os.remove(grayscale_path)

    # Convert to PNG for preview
    png_output = report_path.replace(".pdf", ".png")
    images = convert_from_path(report_path, first_page=1, last_page=1)
    images[0].save(png_output, "PNG")

    return png_output