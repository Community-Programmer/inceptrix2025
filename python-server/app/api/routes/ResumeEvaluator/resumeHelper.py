import json
import re
from werkzeug.utils import secure_filename
from io import BytesIO
import PyPDF2
import subprocess
import os
from groq import Groq

# Initialize Groq client (will be used in is_resume_ai function)
def get_groq_client():
    import os
    from dotenv import load_dotenv
    load_dotenv()
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    return Groq(api_key=GROQ_API_KEY)

# Utility to check allowed file types
def allowed_file(filename: str) -> bool:
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'odt', 'tex', 'html', 'rtf'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to validate if the text is from a resume using AI
async def is_resume_ai(text: str) -> tuple[bool, str]:
    """
    Use AI to determine if the extracted text is from a resume.
    Returns a tuple of (is_resume, reason)
    """
    if not text or len(text.strip()) < 100:
        return False, "The document is too short to be a valid resume."
    
    # Check for common educational document keywords
    educational_keywords = [
        "ASSESSMENT", "BRIEF", "SUBJECT CODE", "LEARNING OUTCOMES", 
        "SUBMISSION", "WEIGHTING", "MARKS", "ASSESSMENT TASK",
        "COURSE OUTLINE", "SYLLABUS", "LECTURE", "TUTORIAL",
        "ASSIGNMENT", "HOMEWORK", "EXAM", "QUIZ", "GRADE"
    ]
    
    # Quick check for educational documents
    text_upper = text.upper()
    educational_keyword_matches = [keyword for keyword in educational_keywords if keyword in text_upper]
    if len(educational_keyword_matches) >= 2:
        return False, f"This appears to be an educational document (contains {', '.join(educational_keyword_matches[:3])})."
    
    # Truncate text if it's too long (to save tokens)
    max_length = 4000
    if len(text) > max_length:
        text = text[:max_length] + "..."
    
    client = get_groq_client()
    
    # Completely revised prompt for better accuracy
    prompt = f"""
    Determine if the following document is SPECIFICALLY a resume/CV or not.
    
    Document text:
    ```
    {text}
    ```
    
    IMPORTANT: Be EXTREMELY strict. This system should ONLY accept actual resumes/CVs.
    
    A resume/CV MUST have ALL of these elements:
    1. Personal contact information (name, email, phone)
    2. Work experience section with job titles, companies, and dates
    3. Education history
    4. Skills section
    
    The following are NOT resumes and must be rejected:
    - Academic papers
    - Assignment briefs or instructions
    - Course outlines or syllabi
    - Articles or blog posts
    - Reports or documentation
    - Letters or emails
    - Any educational documents
    - Any document that doesn't follow resume format
    
    Respond with ONLY:
    "YES: [brief explanation]" if it's definitely a resume/CV
    "NO: [what type of document it appears to be]" if it's not a resume/CV
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a document classification expert with a focus on identifying resumes. You MUST be extremely strict and conservative - only identify documents as resumes if they contain ALL the required elements of a resume/CV. When in doubt, classify as NOT a resume."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,  # Zero temperature for maximum determinism
            max_tokens=100
        )
        
        result = response.choices[0].message.content.strip()
        
        # More robust parsing of the response
        if result.upper().startswith("YES:"):
            return True, result[4:].strip()
        else:
            # Default to NO for any response that doesn't clearly start with YES
            explanation = result[3:].strip() if result.upper().startswith("NO:") else result
            return False, f"This doesn't appear to be a resume. {explanation}"
        
    except Exception as e:
        # If AI fails, be conservative and reject the document
        return False, f"Unable to verify if this is a resume: {str(e)}"

# Utility to extract text from file based on extension
def extract_text(file: BytesIO, file_extension: str) -> str:
    if file_extension == 'pdf':
        return extract_text_from_pdf(file)
    elif file_extension == 'docx':
        return extract_text_from_docx(file)
    elif file_extension == 'odt':
        return extract_text_from_odt(file)
    elif file_extension == 'tex':
        return extract_text_from_tex(file)
    elif file_extension == 'html':
        return extract_text_from_html(file)
    elif file_extension == 'rtf':
        return extract_text_from_rtf(file)
    else:
        file.seek(0)
        return file.read().decode('utf-8')


# Function to extract text from PDF
def extract_text_from_pdf(file: BytesIO) -> str:
    text = ""
    try:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        raise Exception(f"Error extracting PDF text: {e}")
    return text


# Function to extract text from DOCX using docx2txt
def extract_text_from_docx(file: BytesIO) -> str:
    try:
        # Save the file temporarily for docx2txt processing
        with open("temp.docx", "wb") as temp_file:
            temp_file.write(file.read())
        # Use subprocess to run docx2txt
        result = subprocess.run(
            ['docx2txt', 'temp.docx'], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )
        if result.returncode != 0:
            raise Exception(f"Error extracting text from DOCX: {result.stderr.decode()}")
        return result.stdout.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error extracting DOCX text: {e}")
    finally:
        # Clean up temporary file
        if os.path.exists("temp.docx"):
            os.remove("temp.docx")

# Function to extract text from ODT using pandoc (alternative to pypandoc)
def extract_text_from_odt(file: BytesIO) -> str:
    try:
        # Save the file temporarily for pandoc processing
        with open("temp.odt", "wb") as temp_file:
            temp_file.write(file.read())
        # Extract text using pandoc (requires pandoc installed)
        result = subprocess.run(
            ['pandoc', 'temp.odt', '-t', 'plain'], 
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        if result.returncode != 0:
            raise Exception(f"Error extracting text from ODT: {result.stderr.decode()}")
        return result.stdout.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error extracting ODT text: {e}")


# Function to extract text from TEX using pandoc
def extract_text_from_tex(file: BytesIO) -> str:
    try:
        # Save the file temporarily for pandoc processing
        with open("temp.tex", "wb") as temp_file:
            temp_file.write(file.read())
        # Extract text using pandoc (requires pandoc installed)
        result = subprocess.run(
            ['pandoc', 'temp.tex', '-t', 'plain'], 
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        if result.returncode != 0:
            raise Exception(f"Error extracting text from TEX: {result.stderr.decode()}")
        return result.stdout.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error extracting TEX text: {e}")


# Function to extract text from HTML using pandoc
def extract_text_from_html(file: BytesIO) -> str:
    try:
        # Save the file temporarily for pandoc processing
        with open("temp.html", "wb") as temp_file:
            temp_file.write(file.read())
        # Extract text using pandoc (requires pandoc installed)
        result = subprocess.run(
            ['pandoc', 'temp.html', '-t', 'plain'], 
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        if result.returncode != 0:
            raise Exception(f"Error extracting text from HTML: {result.stderr.decode()}")
        return result.stdout.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error extracting HTML text: {e}")


# Function to extract text from RTF using pandoc
def extract_text_from_rtf(file: BytesIO) -> str:
    try:
        # Save the file temporarily for pandoc processing
        with open("temp.rtf", "wb") as temp_file:
            temp_file.write(file.read())
        # Extract text using pandoc (requires pandoc installed)
        result = subprocess.run(
            ['pandoc', 'temp.rtf', '-t', 'plain'], 
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        if result.returncode != 0:
            raise Exception(f"Error extracting text from RTF: {result.stderr.decode()}")
        return result.stdout.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error extracting RTF text: {e}")


# Extract JSON from response content
def extract_json_from_response(response_content: str) -> dict:
    try:
        json_str_match = re.search(r'\{.*\}', response_content, re.DOTALL)
        if json_str_match:
            return json.loads(json_str_match.group())
        raise ValueError("No JSON object found in response")
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON decoding error: {e}")
    except Exception as e:
        raise Exception(f"Error extracting JSON: {e}")
