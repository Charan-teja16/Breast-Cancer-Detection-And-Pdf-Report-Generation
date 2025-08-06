# 🩺 Breast Cancer Detection using Image Classification

A full-stack web application that uses deep learning to detect **IDC (Invasive Ductal Carcinoma)** in breast cancer histopathological images. The system generates structured PDF reports and sends results via WhatsApp using Twilio API.

---

## 🚀 Features

- 🧠 IDC Cancer Prediction using Convolutional Neural Network (CNN)
- 📂 Image upload and classification via FastAPI backend
- 📄 PDF report generation
- 📱 WhatsApp integration with Twilio API
- 🌐 Secure and user-friendly React frontend
- 🗃️ SQLite database for storing user and image info
- 🔐 OTP-based authentication system

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS / CSS Modules

**Backend:**
- FastAPI (Python)
- SQLite (via SQLAlchemy)
- JWT for authentication
- Twilio API (for WhatsApp)

**ML Model:**
- CNN trained on breast histopathological images
- TensorFlow / Keras

**PDF:**
- ReportLab / FPDF (for PDF generation)

---

## 📸 Screenshots

> (Add screenshots of your frontend upload page, prediction result, and PDF report here)

---

## 📦 Installation

### 🔧 Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
