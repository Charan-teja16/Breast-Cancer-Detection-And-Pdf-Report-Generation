from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, predict, email, whatsapp
from app.db import models, database
from fastapi.staticfiles import StaticFiles
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now (for testing)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/reports", StaticFiles(directory="reports"), name="reports")

# Routers
app.include_router(whatsapp.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(predict.router)
app.include_router(email.router)
