from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import Runnable
from langchain_core.documents import Document

import os
import uuid
from datetime import datetime

# Extract text from uploaded PDF files
def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text

# Split long text into manageable chunks
def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

# Generate embeddings and store them in FAISS vector store
def get_vector_store(text_chunks, user_id):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())
    unique_subdirectory = f"{timestamp}_{unique_id}"
    user_directory = os.path.join("faissDatabase", user_id, unique_subdirectory)
    
    os.makedirs(user_directory, exist_ok=True)
    vector_store.save_local(os.path.join(user_directory, "faiss_index"))

# Create a conversational QA chain using a prompt and Google Gemini model
def get_conversational_chain():
    prompt_template = """Answer the question in detail using the context provided. 
If the answer is not in the context, say "answer is not available in the context."

Context:
{context}

Question:
{question}

Answer:"""

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=prompt_template
    )

    model = ChatGoogleGenerativeAI(model="gemini-1.5-pro-001", temperature=0.3)

    def format_docs(docs: list[Document]) -> str:
        return "\n\n".join(doc.page_content for doc in docs)

    chain: Runnable = (
        {"context": lambda x: format_docs(x["input_documents"]), "question": lambda x: x["question"]}
        | prompt
        | model
    )

    return chain
