from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.PdfChat import pdfchat
from app.api.routes.SmartWhiteBoard import whiteboard
from app.api.routes.ResumeEvaluator import ResumeScore

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5050",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdfchat.router, prefix="/api/v1/pdf-chat", tags=["pdfchat"])
app.include_router(whiteboard.router, prefix="/api/v1/whiteboard", tags=["whiteboard"])
app.include_router(ResumeScore.router, prefix="/api/v1/evaluate-resume", tags=["resume"])

@app.get("/")
def root():
    return {"message":"Welcome to Next Hire Python Backend","status":"Ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
