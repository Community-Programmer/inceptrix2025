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
app.include_router(resume.router, prefix="/api/v1/upload", tags=["resume"])
app.include_router(ResumeScore.router, prefix="/api/v1/resume", tags=["resume-evaluator"])

@app.get('/')
def root():
    return {"message":"Welcome to Next Hire Python Backend","status":"Ok"}



import os
import time
import json
import boto3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from typing import List, Optional

# Configurations
GEMINI_API_KEY = "AIzaSyAQOMwXzurb2j-hiH4NnjYa6ZEMSbWWt-E"
LOCAL_VIDEO_PATH = "video.mp4"

client = genai.Client(api_key=GEMINI_API_KEY)

access_key = os.getenv("AWS_ACCESS_KEY")
secret_key = os.getenv("AWS_SECRET_KEY")
aws_region = os.getenv("AWS_REGION")
bucket_name = os.getenv("BUCKET_NAME")

class CodeQuality(BaseModel):
    rating: str
    comments: List[str]

class TechnicalAssessment(BaseModel):
    score: int
    feedback: str
    strengths: List[str]
    weaknesses: List[str]
    codeQuality: Optional[CodeQuality]

class ProjectDiscussion(BaseModel):
    score: int
    feedback: str
    insights: List[str]
    technicalDepth: str

class BehavioralAssessment(BaseModel):
    score: int
    feedback: str
    communicationSkills: str
    problemSolving: str
    teamwork: str

class MalpracticeFlag(BaseModel):
    timestamp: str
    type: str
    description: str

class InterviewResult(BaseModel):
    technicalAssessment: TechnicalAssessment
    projectDiscussion: ProjectDiscussion
    behavioralAssessment: BehavioralAssessment
    malpracticeFlags: List[MalpracticeFlag]
    overallScore: int
    finalRecommendation: str


s3_client = boto3.client("s3", aws_access_key_id=access_key,
                        aws_secret_access_key=secret_key,
                        region_name=aws_region)

# Request schema
class S3Input(BaseModel):
    bucket: str
    key: str

@app.post('/analyze-interview')
def analyze_interview(input_data: S3Input):
    # --- Step 1: Download from S3 ---
    print(f"Downloading video from S3 bucket: {input_data.bucket}, key: {input_data.key}")
    try:
        s3_client.download_file(input_data.bucket, input_data.key, LOCAL_VIDEO_PATH)
    except Exception as e:
        print(f"Error downloading video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to download video from S3: {str(e)}")

    # --- Step 2: Upload video to Gemini ---
    try:
        video_file = client.files.upload(file=LOCAL_VIDEO_PATH)
        while True:
            file_info = client.files.get(name=video_file.name)
            if file_info.state == "ACTIVE":
                break
            time.sleep(2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini upload error: {str(e)}")

    # --- Step 3: Prompt for deep analysis ---
    initial_prompt = """You are an expert interviewer and behavioral analyst...
    ... [TRIMMED for brevity, same as before] ...
    Return your results in a structured and easy-to-read format."""
    
    prompt = """
        You are an expert interviewer and behavioral analyst. You will be given a video of an AI-assisted interview.
        Perform a structured assessment according to this JSON schema:
        - Evaluate technical, behavioral, and project responses
        - Detect any signs of malpractice (whispers, third-party voices, etc.)
        - Provide a score out of 100 for each section and final recommendation
        """

        # Gemini structured content generation using Pydantic schema
    response1 = client.models.generate_content(
            model="gemini-2.5-pro-exp-03-25",
            contents=[video_file, prompt],
            config={
                "response_mime_type": "application/json",
                "response_schema": InterviewResult,
            }
        )
    
    initial_prompt = """
You are an expert interviewer and behavioral analyst. You will be given a video of an AI-assisted interview.

Please perform the following tasks:

1. Break down the interview into sections based on timestamps (e.g., introduction, question responses, closing).
2. For each question:
   - Identify the question asked
   - Summarize the candidate’s answer
   - Compare the response with an expected ideal answer
   - Provide a rating out of 10 for each response based on clarity, relevance, and confidence
3. Identify and report any signs of cheating or malpractice (e.g., suspicious eye movements, sudden silences, whispering, third-party voices).
4. Provide specific timestamps for all observations (including suspicious activity).
5. Offer a summary of the candidate’s communication style (e.g., confident, hesitant, assertive).
6. Give detailed feedback on:
   - Verbal and non-verbal communication
   - Technical knowledge
   - Emotional intelligence
7. Provide an overall rating of the interview performance out of 100.
8. Provide actionable suggestions for improvement.

Return your results in a structured and easy-to-read format (preferably bullet points or a markdown-style layout).
"""
    response2 = client.models.generate_content(
    model="gemini-2.5-pro-exp-03-25",
    contents=[video_file, initial_prompt]
)
    

    return {
    "structured_response": response1.parsed,
    "detailed_response": response2.text
}




if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
