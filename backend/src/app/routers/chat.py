from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import os

# Optional imports for Groq (will be available after pip install)
try:
    from groq import Groq
    from dotenv import load_dotenv
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    print("Warning: groq and python-dotenv packages not installed. Chat functionality will be limited.")

# Load environment variables if available
if GROQ_AVAILABLE:
    load_dotenv()

router = APIRouter()

# Session tracking (in-memory for MVP)
session_message_counts: Dict[str, int] = {}

# Initialize Groq client
groq_client = None
if GROQ_AVAILABLE:
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if api_key and api_key != "your_groq_api_key_here":
            groq_client = Groq(api_key=api_key)
    except Exception as e:
        print(f"Warning: Groq client initialization failed: {e}")
else:
    print("Groq packages not available - chat will return mock responses")


class ChatContext(BaseModel):
    verdict: str
    confidence: int
    features: List[Dict[str, Any]]
    explanation: str
    input_values: Dict[str, Any]


class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Unique session identifier")
    message: str = Field(..., description="User's question")
    context: ChatContext = Field(..., description="Analysis result context")


class ChatResponse(BaseModel):
    response: str
    remaining_messages: int
    limit_reached: bool


def validate_user_input(message: str) -> bool:
    """Validate user input to prevent probing questions about system internals."""
    
    # List of probing patterns to block
    probing_patterns = [
        # Technical probing
        "what model", "what algorithm", "how does the model", "model architecture",
        "what technology", "what framework", "what library", "what api",
        
        # System probing
        "how is this built", "what's the backend", "what's the frontend",
        "what database", "what server", "what infrastructure",
        
        # Implementation probing
        "show me the code", "what's the source code", "how is this implemented",
        "what files", "what directories", "what endpoints",
        
        # Data probing
        "what training data", "what dataset", "how was this trained",
        "what parameters", "what hyperparameters", "what features",
        
        # Security probing
        "what's the api key", "what credentials", "what tokens",
        "what environment", "what configuration", "what secrets"
    ]
    
    message_lower = message.lower()
    
    # Check for probing patterns
    for pattern in probing_patterns:
        if pattern in message_lower:
            return False
    
    return True


def filter_sensitive_content(response: str) -> str:
    """Filter out any potentially sensitive information from AI responses."""
    
    # List of sensitive terms that should be blocked
    sensitive_terms = [
        # Technical implementation
        "random forest", "rf_baseline", "joblib", "sklearn", "scikit-learn",
        "predict_proba", "imputer", "scaler", "feature_importances",
        
        # Codebase structure
        "backend", "frontend", "src/", "app/", "routers/", "main.py",
        "tabular.py", "chat.py", "requirements.txt", "pyproject.toml",
        
        # API/System details
        "fastapi", "uvicorn", "localhost:8000", "/v1/", "endpoint",
        "api key", "groq", "llama", "model", "training", "artifacts",
        
        # File paths and technical details
        "ML/Data Pipeline", "artifacts/", ".joblib", ".csv", ".parquet",
        "unified_raw", "kepler", "tess", "k2", "mission",
        
        # Internal processes
        "database", "sql", "postgres", "mysql", "mongo", "redis",
        "docker", "kubernetes", "aws", "azure", "gcp", "deployment"
    ]
    
    # Convert to lowercase for case-insensitive matching
    response_lower = response.lower()
    
    # Check for sensitive terms
    for term in sensitive_terms:
        if term in response_lower:
            return "I can only explain the analysis results. For technical questions, please contact NASA support."
    
    return response


def create_system_prompt(context: ChatContext) -> str:
    """Create a strict system prompt with security guardrails."""
    
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

STRICT SECURITY RULES:
1. ONLY answer questions about THIS specific analysis result
2. ONLY discuss exoplanet detection, transit method, and the features shown
3. NEVER reveal information about:
   - Model architecture, algorithms, or implementation details
   - Codebase structure, file names, or technical infrastructure
   - Training data, model parameters, or technical specifications
   - API endpoints, system architecture, or deployment details
   - Any internal NASA systems, databases, or technical processes
4. If asked about technical implementation, respond: "I can only explain the analysis results. For technical questions, please contact NASA support."
5. If asked about unrelated topics, respond: "I can only answer questions about this specific exoplanet analysis result. Please ask about the detection confidence, feature importance, or the transit method used."
6. Keep responses under 150 words
7. Be educational but concise
8. Use ONLY the context data provided to answer questions
9. NEVER speculate about technical implementation or system details

User question: {{user_message}}"""
    
    return system_prompt


@router.post("/ask", response_model=ChatResponse)
def ask_chat(req: ChatRequest) -> ChatResponse:
    """Handle chat requests with 3-message limit per session."""
    
    # Validate user input for security
    if not validate_user_input(req.message):
        return ChatResponse(
            response="I can only explain the analysis results. For technical questions, please contact NASA support.",
            remaining_messages=req.session_id in session_message_counts and session_message_counts[req.session_id] or 0,
            limit_reached=False
        )
    
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
        
        # Apply security filtering
        filtered_response = filter_sensitive_content(ai_response)
        
        # Update session count
        session_message_counts[req.session_id] = current_count + 1
        remaining = 3 - (current_count + 1)
        
        return ChatResponse(
            response=filtered_response,
            remaining_messages=remaining,
            limit_reached=remaining == 0
        )
        
    except Exception as e:
        print(f"Groq API error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to process your question. Please try again."
        )
