from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Session tracking (in-memory for MVP)
session_message_counts: Dict[str, int] = {}

# Initialize Groq client
groq_client = None
try:
    api_key = os.getenv("GROQ_API_KEY")
    if api_key and api_key != "your_groq_api_key_here":
        groq_client = Groq(api_key=api_key)
except Exception as e:
    print(f"Warning: Groq client initialization failed: {e}")


class ChatContext(BaseModel):
    verdict: str
    confidence: int
    features: List[Dict[str, any]]
    explanation: str
    input_values: Dict[str, any]


class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Unique session identifier")
    message: str = Field(..., description="User's question")
    context: ChatContext = Field(..., description="Analysis result context")


class ChatResponse(BaseModel):
    response: str
    remaining_messages: int
    limit_reached: bool


def create_system_prompt(context: ChatContext) -> str:
    """Create a strict system prompt with guardrails."""
    
    # Format feature list
    feature_list = []
    for feature in context.features:
        feature_list.append(f"- {feature['feature']}: {feature['importance']*100:.1f}% (value={feature['detail'].split('=')[1] if '=' in feature['detail'] else 'N/A'})")
    feature_list_str = "\n".join(feature_list)
    
    # Format input values
    input_values_str = ", ".join([f"{k}={v}" for k, v in context.input_values.items()])
    
    system_prompt = f"""You are a NASA exoplanet detection AI assistant. Your ONLY purpose is to explain exoplanet analysis results to users.

CONTEXT:
- Verdict: {context.verdict}
- Confidence: {context.confidence}%
- Top Features: 
{feature_list_str}
- Explanation: {context.explanation}
- User Input Values: {input_values_str}

RULES:
1. ONLY answer questions about THIS specific analysis result
2. ONLY discuss exoplanet detection, transit method, and the features shown
3. If asked about unrelated topics (politics, general science, other planets, etc.), respond: "I can only answer questions about this specific exoplanet analysis result. Please ask about the detection confidence, feature importance, or the transit method used."
4. Keep responses under 150 words
5. Be educational but concise
6. Use the context data to provide specific answers

User question: {{user_message}}"""
    
    return system_prompt


@router.post("/ask", response_model=ChatResponse)
def ask_chat(req: ChatRequest) -> ChatResponse:
    """Handle chat requests with 3-message limit per session."""
    
    # Check if Groq client is available
    if not groq_client:
        raise HTTPException(
            status_code=503, 
            detail="AI assistant is currently unavailable. Please try again later."
        )
    
    # Check message limit
    current_count = session_message_counts.get(req.session_id, 0)
    if current_count >= 3:
        return ChatResponse(
            response="You've reached the 3-message limit for this session. Please contact us for enterprise services for more AI answers.",
            remaining_messages=0,
            limit_reached=True
        )
    
    try:
        # Create system prompt
        system_prompt = create_system_prompt(req.context)
        
        # Call Groq API
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user", 
                    "content": req.message
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=200,
            top_p=0.9
        )
        
        # Extract response
        ai_response = chat_completion.choices[0].message.content
        
        # Update session count
        session_message_counts[req.session_id] = current_count + 1
        remaining = 3 - (current_count + 1)
        
        return ChatResponse(
            response=ai_response,
            remaining_messages=remaining,
            limit_reached=remaining == 0
        )
        
    except Exception as e:
        print(f"Groq API error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to process your question. Please try again."
        )
