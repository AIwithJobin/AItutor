from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List, Dict, Any

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import progress tracker data
from data.progress_tracker import PROGRESS_TRACKER

class ChatRequest(BaseModel):
    message: str
    topicIndex: int
    conversationHistory: List[Dict[str, str]]

class CodeSubmission(BaseModel):
    question: str
    code: str

@app.post("/api/generate-intro")
async def generate_intro(topicIndex: int):
    try:
        current_topic = PROGRESS_TRACKER[topicIndex]
        prompt = f"""
        Provide a comprehensive lesson introduction for: {current_topic['topic']}
        - Explain why this concept is important
        - Break down key components clearly
        - Provide 2-3 practical examples
        {"Mention that coding exercises are available for this topic." if current_topic['needs_coding'] else ""}
        - End with a question to check understanding
        """
        response = model.generate_content(prompt)
        return {"message": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        current_topic = PROGRESS_TRACKER[request.topicIndex]
        prompt = f"""
        Context: Teaching {current_topic['topic']} in computer science.
        Conversation history:
        {request.conversationHistory[-5:]}
        
        Student question: {request.message}
        
        Respond as an expert tutor:
        1. Answer clearly and concisely
        2. Provide examples when helpful
        3. {"Suggest coding exercises if relevant" if current_topic['needs_coding'] else ""}
        4. End with a follow-up question
        """
        response = model.generate_content(prompt)
        return {"message": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-problem")
async def generate_problem():
    try:
        prompt = """
        Create a coding exercise for the current topic.
        Requirements:
        - Appropriate for beginner/intermediate programmers
        - Clear problem statement
        - 1-2 sample inputs/outputs
        - Focus on core concept
        """
        response = model.generate_content(prompt)
        return {"question": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/submit-code")
async def submit_code(submission: CodeSubmission):
    try:
        feedback_prompt = f"""
        Evaluate this code solution:
        
        Problem Statement:
        {submission.question}
        
        Student's Code:
        {submission.code}
        
        Provide detailed feedback:
        1. Is the solution correct? (Yes/Partially/No)
        2. What works well?
        3. What needs improvement?
        4. Specific suggestions for better approaches
        5. A corrected version if needed
        """
        response = model.generate_content(feedback_prompt)
        return {"feedback": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 