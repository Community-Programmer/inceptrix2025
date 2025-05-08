from fastapi import FastAPI, File, UploadFile, Request, HTTPException
import uvicorn
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.PdfChat import pdfchat
from app.api.routes.SmartWhiteBoard import whiteboard
from app.api.routes.Resume import resume
from typing import List
import shutil

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5050",
    "http://localhost:5173",
    "http://localhost:5173/"
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
app.include_router(resume.router, prefix="/api/v1/resume", tags=["resume"])


# @app.post("/upload-pdfs")
# async def upload_pdfs(request: Request,files: List[UploadFile] = File(...)):
#     user = authUser.authenticateUser(request.cookies.get('refreshToken'))
#     print(user)
#     pdf_docs = [pdf.file for pdf in files]
#     # raw_text = get_pdf_text(pdf_docs)
#     # text_chunks = get_text_chunks(raw_text)
#     # get_vector_store(text_chunks,user['id'])
#     return {"message": "PDFs processed and vector store created successfully."}

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @app.post("/upload-pdf")
# async def upload_resume(request: Request, resume: UploadFile = File(...)):
#     if not resume.filename.endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDF files are allowed")
#     print(request.cookies)
#     user = authUser.authenticateUser(request.cookies.get('refreshToken'))

#     save_path = os.path.join(UPLOAD_FOLDER, user['id']+'.pdf')

#     with open(save_path, "wb") as buffer:
#         shutil.copyfileobj(resume.file, buffer)

#     return {"message": "File uploaded successfully", "filename": resume.filename}

@app.get("/")
def root():
    return {"message":"Welcome to Next Hire Python Backend","status":"Ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
