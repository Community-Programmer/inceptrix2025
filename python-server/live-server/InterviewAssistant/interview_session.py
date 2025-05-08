# interview_session.py

import datetime
import json
from livekit import api, agents
from resume_parser import query_groq, build_resume_parsing_prompt
from pdf_utils import extract_text_from_pdf
from interview_assistant import Assistant
from livekit.plugins import bey
from livekit.agents import AgentSession, ChatContext, RoomInputOptions
from livekit.plugins import google, bey
import os

access_key = os.getenv("AWS_ACCESS_KEY")
secret_key = os.getenv("AWS_SECRET_KEY")
aws_region = os.getenv("AWS_REGION")
bucket_name = os.getenv("BUCKET_NAME")

async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()

    req = api.RoomCompositeEgressRequest(
        room_name=ctx.room.name,
        file_outputs=[api.EncodedFileOutput(
            file_type=api.EncodedFileType.MP4,
            filepath="my-room-test.mp4",
            s3=api.S3Upload(
                bucket=bucket_name,
                region=aws_region,
                access_key=access_key,
                secret=secret_key,
            ),
        )],
    )
    lkapi = api.LiveKitAPI()
    res = await lkapi.egress.start_room_composite_egress(req)

    await lkapi.aclose()

    # === Setup Session ===
    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-exp",
            voice="Puck",
            temperature=1.0,
            instructions="""
You are the live agent for a structured technical interview. Use the following guidance:

**1. Interview Structure**  
- **Opening (1-2 minutes):**  
  1. “Hello [Candidate Name], welcome. You're interviewing for [Role].”  
  2. “We'll cover technical skills, deep dives on your projects, behavioral questions, then wrap up.”  
- **Technical Round (10-15 minutes):**  
  - Start with language fundamentals: data types, control flow, error handling.  
  - Move into problem solving: ask a coding puzzle or algorithm question, request thought process and pseudo-code.  
  - Cover system design: “Design a highly available microservice for X.”  
- **Project Deep-Dive (10 minutes):**  
  - “On your sentiment-analysis Twitter project, how did you handle streaming, preprocessing, and latency?”  
  - Ask follow-ups: “What libraries? How did you evaluate model accuracy? How did you deploy to AWS?”  
- **Behavioral/Situational (5-7 minutes):**  
  - “Tell me about a time you disagreed with a teammate. How did you resolve it?”  
  - “Describe handling a production outage under pressure.”  
- **Closing (1-2 minutes):**  
  - “Do you have any questions for us?”  
  - “Next steps: we'll get back within X days.”  

**2. Quality Control**  
- Prompt for specifics: “Can you paste or describe actual code?”  
- Avoid accepting “I googled it” or “I vaguely recall”; insist on first-hand experience.  
- Keep follow-ups sharp: “Why did you choose that approach over alternatives?”  

**3. Malpractice Monitoring**  
Continuously run computer-vision and audio analysis to detect:
- **Gaze & Attention:** camera-gaze off-screen >5 seconds → “Please maintain camera focus.”  
- **Multiple People:** >1 face → “Please ensure only you are visible.”  
- **Unauthorized Objects:** phones, books, notes → “Remove any reference material from view.”  
- **Multiple Voices:** simultaneous voices → “Please ensure you're the only speaker.”  
- **Suspicious Sounds:** phone notifications → “Please silence notifications.”  
Log every incident in the transcript with timestamp and type of flag for post-interview review.  
"""
        )
    )

    # Inject resume context
    pdf_text = extract_text_from_pdf("./resume.pdf")  # Update filename
    prompt = build_resume_parsing_prompt(pdf_text)
    resume_text = query_groq(prompt)

    initial_ctx = ChatContext()
    initial_ctx.add_message(role="assistant", content=f"The following is the candidate's resume:\n{resume_text}")

    # === Optional: Save transcript on shutdown ===
    async def write_transcript():
        current_date = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"transcript_{ctx.room.name}_{current_date}.json"
        with open(filename, 'w') as f:
            json.dump(session.history.to_dict(), f, indent=2)
        print(f"[INFO] Transcript saved to {filename}")

    ctx.add_shutdown_callback(write_transcript)

    avatar = bey.AvatarSession(
        avatar_id="b9be11b8-89fb-4227-8f86-4a881393cbdb"
    )
    await avatar.start(session, room=ctx.room)

    # === Start Interview Session ===
    await session.start(
        room=ctx.room,
        agent=Assistant(chat_ctx=initial_ctx),
        room_input_options=RoomInputOptions(audio_enabled=True, video_enabled=True),
    )

    await session.generate_reply(instructions="""You may begin the interview now. """)
