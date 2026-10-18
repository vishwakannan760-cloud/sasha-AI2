"""
SASHA AI — Main FastAPI Application
------------------------------------
FastAPI server powering SASHA AI chat, learning coach, project workspace,
and SQLite persistence.

Author: SASHA AI Project
"""

import os
import sys
import uuid
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

# Ensure workspace root is in sys.path regardless of execution directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Internal modules
from backend import database
from backend import ai_service
from backend import code_runner

app = FastAPI(
    title="SASHA AI Server",
    description="Your AI. Your Companion. Your Future.",
    version="1.0.0"
)

# CORS middleware for open development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Data Models ---

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str = Field(..., min_length=1)
    model: str = "sasha_demo"
    api_key: Optional[str] = None
    attachments: Optional[List[Dict[str, Any]]] = []

class ConversationCreateRequest(BaseModel):
    title: Optional[str] = "New Conversation"

class ConversationUpdateRequest(BaseModel):
    title: str = Field(..., min_length=1)

class ProjectCreateRequest(BaseModel):
    name: str = Field(..., min_length=1)
    description: str
    status: str = "Planning"
    tags: List[str] = []
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""

class ProjectUpdateRequest(BaseModel):
    name: str = Field(..., min_length=1)
    description: str
    status: str
    tags: List[str] = []
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""

class MemoryCreateRequest(BaseModel):
    key: str = Field(..., min_length=1)
    value: str = Field(..., min_length=1)
    category: str = "general"

class CodeRunRequest(BaseModel):
    code: str

# --- Endpoints ---

@app.get("/api/health")
def health_check():
    """Health status and runtime environment info."""
    return {
        "status": "online",
        "service": "SASHA AI Backend",
        "python_version": sys.version,
        "default_model": "SASHA Smart Engine",
        "has_server_gemini_key": bool(os.environ.get("GEMINI_API_KEY"))
    }

# --- Conversations API ---

@app.get("/api/conversations")
def list_conversations():
    """Returns all conversations sorted by latest update."""
    return {"conversations": database.get_conversations()}

@app.post("/api/conversations")
def create_new_conversation(req: ConversationCreateRequest):
    """Creates a new conversation."""
    conv_id = f"conv-{uuid.uuid4().hex[:12]}"
    conv = database.create_conversation(conv_id, req.title or "New Conversation")
    return {"conversation": conv}

@app.get("/api/conversations/{conv_id}/messages")
def get_conversation_messages(conv_id: str):
    """Returns all messages belonging to a conversation."""
    conv = database.get_conversation(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = database.get_messages(conv_id)
    return {"conversation": conv, "messages": messages}

@app.put("/api/conversations/{conv_id}")
def update_conversation(conv_id: str, req: ConversationUpdateRequest):
    """Renames an existing conversation."""
    success = database.rename_conversation(conv_id, req.title)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"success": True, "title": req.title}

@app.delete("/api/conversations/{conv_id}")
def delete_conversation(conv_id: str):
    """Deletes a conversation and its messages."""
    success = database.delete_conversation(conv_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"success": True, "deleted_id": conv_id}

# --- Chat & AI Endpoint ---

@app.post("/api/chat")
def handle_chat(req: ChatRequest):
    """
    Core AI chat endpoint.
    Saves user message, formats conversation history, calls AI engine,
    saves and returns SASHA AI response.
    """
    # 1. Ensure conversation exists
    conv_id = req.conversation_id
    is_new = False
    if not conv_id:
        conv_id = f"conv-{uuid.uuid4().hex[:12]}"
        # Generate initial title from prompt
        title = req.message.strip().split("\n")[0][:36]
        if len(req.message.strip().split("\n")[0]) > 36:
            title += "..."
        database.create_conversation(conv_id, title)
        is_new = True
    else:
        existing = database.get_conversation(conv_id)
        if not existing:
            title = req.message.strip().split("\n")[0][:36]
            database.create_conversation(conv_id, title)

    # 2. Save user message
    user_msg_id = f"msg-{uuid.uuid4().hex[:12]}"
    user_msg = database.add_message(
        msg_id=user_msg_id,
        conv_id=conv_id,
        sender="user",
        content=req.message,
        attachments=req.attachments or []
    )

    # 3. Retrieve recent history for context
    history_records = database.get_messages(conv_id)
    formatted_history = []
    for m in history_records[-10:]:
        role = "user" if m["sender"] == "user" else "model"
        formatted_history.append({"role": role, "content": m["content"]})

    # 4. Generate AI response
    ai_result = ai_service.generate_chat_response(
        prompt=req.message,
        conversation_history=formatted_history,
        model_preference=req.model,
        user_api_key=req.api_key
    )

    reply_content = ai_result.get("reply", "I'm here to help, but encountered an empty response.")
    model_used = ai_result.get("model_used", "SASHA Engine")

    # 5. Save AI response
    ai_msg_id = f"msg-{uuid.uuid4().hex[:12]}"
    ai_msg = database.add_message(
        msg_id=ai_msg_id,
        conv_id=conv_id,
        sender="sasha",
        content=reply_content,
        model=model_used
    )

    return {
        "conversation_id": conv_id,
        "is_new": is_new,
        "user_message": user_msg,
        "ai_message": ai_msg,
        "model_used": model_used,
        "is_demo": ai_result.get("is_demo", True),
        "warning": ai_result.get("warning")
    }

# --- Developer Projects (Section 8) ---

@app.get("/api/projects")
def list_projects():
    """Returns developer project cards."""
    return {"projects": database.get_projects()}

@app.post("/api/projects")
def create_project(req: ProjectCreateRequest):
    """Creates a new project card."""
    proj_id = f"proj-{uuid.uuid4().hex[:8]}"
    project = database.create_project(
        proj_id=proj_id,
        name=req.name,
        description=req.description,
        status=req.status,
        tags=req.tags,
        github_url=req.github_url or "",
        live_url=req.live_url or ""
    )
    return {"project": project}

@app.put("/api/projects/{proj_id}")
def update_project(proj_id: str, req: ProjectUpdateRequest):
    """Updates an existing project card."""
    success = database.update_project(
        proj_id=proj_id,
        name=req.name,
        description=req.description,
        status=req.status,
        tags=req.tags,
        github_url=req.github_url or "",
        live_url=req.live_url or ""
    )
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True, "updated_id": proj_id}

@app.delete("/api/projects/{proj_id}")
def delete_project(proj_id: str):
    """Deletes a project card."""
    success = database.delete_project(proj_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True, "deleted_id": proj_id}

# --- Memory & Preferences (Section 9) ---

@app.get("/api/memory")
def get_memory():
    """Returns user memory items."""
    return {"memory_items": database.get_memory_items()}

@app.post("/api/memory")
def add_memory(req: MemoryCreateRequest):
    """Adds a new user memory item."""
    mem_id = f"mem-{uuid.uuid4().hex[:8]}"
    item = database.add_memory_item(mem_id, req.key, req.value, req.category)
    return {"memory_item": item}

@app.delete("/api/memory/{mem_id}")
def delete_memory(mem_id: str):
    """Deletes a memory item."""
    success = database.delete_memory_item(mem_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory item not found")
    return {"success": True, "deleted_id": mem_id}

# --- Code Runner (Section 7) ---

@app.post("/api/run-code")
def run_code(req: CodeRunRequest):
    """Executes a Python code snippet and returns output."""
    result = code_runner.execute_python_code(req.code)
    return result

# --- Global Exception Handler to Prevent 500 Function Crashes ---

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Catches any unhandled exceptions and prevents 500 FUNCTION_INVOCATION_FAILED crashes.
    Returns clear, structured JSON debugging info.
    """
    import traceback
    trace = traceback.format_exc()
    print(f"Server Error occurred at {request.url.path}:\n{trace}")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": f"Server encountered an issue: {str(exc)}",
            "type": type(exc).__name__,
            "path": request.url.path
        }
    )

# --- Static Files & Root View ---

def find_static_dir():
    candidates = [
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static"),
        os.path.join(os.getcwd(), "static"),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "static"),
        "/var/task/static"
    ]
    for c in candidates:
        if os.path.isdir(c):
            return c
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")

STATIC_DIR = find_static_dir()

if os.path.isdir(STATIC_DIR):
    try:
        app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    except Exception as e:
        print(f"Warning: Could not mount /static: {e}")

@app.get("/")
@app.get("/index.html")
def serve_root():
    """Serves the main SASHA AI Single Page Application."""
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file, media_type="text/html")
    return JSONResponse({
        "status": "online",
        "service": "SASHA AI Backend",
        "message": "Backend server is running. Static files are located at " + STATIC_DIR
    })

@app.get("/favicon.ico")
def serve_favicon():
    return JSONResponse({"status": "no_favicon"}, status_code=204)

if __name__ == "__main__":
    import uvicorn
    print("Starting SASHA AI server on http://127.0.0.1:8000 ...")
    uvicorn.run("backend.app:app", host="127.0.0.1", port=8000, reload=True)

