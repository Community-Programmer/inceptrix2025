from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from app.api.middlewares import authUser
import os
import shutil
from pymongo import MongoClient
from bson import ObjectId

router = APIRouter()

MONOGO_URI = os.getenv("MONGODB_CONNECTION_STRING")

client = MongoClient(MONOGO_URI)
db = client["nextHire"]
users_collection = db["User"]

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload-pdf")
async def upload_resume(request: Request, resume: UploadFile = File(...)):
    if not resume.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    print(request.cookies)
    user = authUser.authenticateUser(request.cookies.get('refreshToken'))

    save_path = os.path.join(UPLOAD_FOLDER, user['id']+'.pdf')

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    object_id = ObjectId(user['id'])
    print(object_id)
    result = users_collection.update_one(
        {"_id": object_id},
        {"$set": {"isResumeUploaded": True}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "File uploaded successfully", "filename": resume.filename}