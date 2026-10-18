"""
SASHA AI — Database Module
--------------------------
Handles persistent storage using Python's built-in SQLite database.
Stores chat conversations, messages, developer project cards, and user memory.

Author: SASHA AI Development Team
For: Python Full Stack Learner
"""

import sqlite3
import os
import json
from datetime import datetime
import tempfile

_MEMORY_CONN = None

def get_db_path() -> str:
    """
    Resolves the SQLite database path safely.
    In serverless environments (Vercel, AWS Lambda) or read-only containers,
    the application directory is read-only, so we fallback to the temporary directory.
    """
    # 1. Serverless environment detection
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        return os.path.join(tempfile.gettempdir(), "sasha_ai.db")

    # 2. Try standard local data directory
    local_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    try:
        os.makedirs(local_dir, exist_ok=True)
        # Verify writable
        test_file = os.path.join(local_dir, ".write_test")
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
        return os.path.join(local_dir, "sasha_ai.db")
    except (OSError, PermissionError):
        # Fall back to system temp directory
        return os.path.join(tempfile.gettempdir(), "sasha_ai.db")

def get_connection():
    """Returns a SQLite connection with dictionary row formatting and fallback support."""
    global _MEMORY_CONN
    db_path = get_db_path()

    try:
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        conn = sqlite3.connect(db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        print(f"Warning: Failed to open SQLite at {db_path} ({e}). Falling back to persistent in-memory database.")
        if _MEMORY_CONN is None:
            _MEMORY_CONN = sqlite3.connect(":memory:", check_same_thread=False)
            _MEMORY_CONN.row_factory = sqlite3.Row
        return _MEMORY_CONN

def init_db():
    """Initializes database tables and default seed data if not present."""
    with get_connection() as conn:
        cursor = conn.cursor()

        # 1. Conversations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 2. Messages table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                conversation_id TEXT NOT NULL,
                sender TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                model TEXT DEFAULT 'SASHA Engine',
                attachments TEXT DEFAULT '[]',
                FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
            )
        """)

        # 3. Developer Projects table (Section 8: My Projects)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'In Progress',
                tags TEXT NOT NULL DEFAULT '[]',
                github_url TEXT DEFAULT '',
                live_url TEXT DEFAULT '',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 4. User Memory & Preferences table (Section 9 & 12)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS memory_items (
                id TEXT PRIMARY KEY,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()

        # Seed default projects if none exist
        cursor.execute("SELECT COUNT(*) as count FROM projects")
        if cursor.fetchone()["count"] == 0:
            default_projects = [
                (
                    "proj-sasha-1",
                    "SASHA AI",
                    "My personal AI assistant web app featuring interactive chat, learning coach, and project workspace.",
                    "In Progress",
                    json.dumps(["Python 3.15", "FastAPI", "Tailwind CSS", "Gemini API"]),
                    "",
                    ""
                ),
                (
                    "proj-portfolio-2",
                    "Personal Portfolio Website",
                    "A responsive modern portfolio to showcase my full-stack projects and Python skills to recruiters.",
                    "Planning",
                    json.dumps(["HTML5", "CSS3", "JavaScript", "Responsive Design"]),
                    "",
                    ""
                ),
                (
                    "proj-python-3",
                    "Python Practice Projects",
                    "Hands-on exercises covering OOP, data structures, file handling, and CLI automation utilities.",
                    "In Progress",
                    json.dumps(["Python", "OOP", "Data Structures", "Algorithms"]),
                    "",
                    ""
                ),
                (
                    "proj-future-ai-4",
                    "Future AI Experiments",
                    "Exploration of Large Language Models, prompt engineering, RAG, and intelligent agent workflows.",
                    "Planning",
                    json.dumps(["LLMs", "RAG", "Embeddings", "FastAPI"]),
                    "",
                    ""
                )
            ]
            cursor.executemany("""
                INSERT INTO projects (id, name, description, status, tags, github_url, live_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, default_projects)
            conn.commit()

        # Seed default memory items
        cursor.execute("SELECT COUNT(*) as count FROM memory_items")
        if cursor.fetchone()["count"] == 0:
            default_memory = [
                ("mem-1", "Developer Profile", "Aspiring Python Full Stack Developer working towards building SASHA AI", "profile"),
                ("mem-2", "Language Preference", "English with support for Tamil & Tanglish explanations", "preferences"),
                ("mem-3", "Learning Focus", "Python fundamentals, OOP, FastAPI backend, and Web Frontend", "learning")
            ]
            cursor.executemany("""
                INSERT INTO memory_items (id, key, value, category)
                VALUES (?, ?, ?, ?)
            """, default_memory)
            conn.commit()

# --- Conversation operations ---

def get_conversations() -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM conversations ORDER BY updated_at DESC")
        return [dict(row) for row in cursor.fetchall()]

def get_conversation(conv_id: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def create_conversation(conv_id: str, title: str) -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        now = datetime.utcnow().isoformat()
        cursor.execute(
            "INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (conv_id, title, now, now)
        )
        conn.commit()
        return {"id": conv_id, "title": title, "created_at": now, "updated_at": now}

def rename_conversation(conv_id: str, new_title: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?",
            (new_title, datetime.utcnow().isoformat(), conv_id)
        )
        conn.commit()
        return cursor.rowcount > 0

def delete_conversation(conv_id: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
        cursor.execute("DELETE FROM conversations WHERE id = ?", (conv_id,))
        conn.commit()
        return cursor.rowcount > 0

# --- Message operations ---

def get_messages(conv_id: str) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
            (conv_id,)
        )
        messages = []
        for row in cursor.fetchall():
            m = dict(row)
            try:
                m["attachments"] = json.loads(m.get("attachments", "[]"))
            except Exception:
                m["attachments"] = []
            messages.append(m)
        return messages

def add_message(msg_id: str, conv_id: str, sender: str, content: str, model: str = "SASHA Engine", attachments: list = None) -> Dict[str, Any]:
    if attachments is None:
        attachments = []
    with get_connection() as conn:
        cursor = conn.cursor()
        now = datetime.utcnow().isoformat()
        cursor.execute("""
            INSERT INTO messages (id, conversation_id, sender, content, created_at, model, attachments)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (msg_id, conv_id, sender, content, now, model, json.dumps(attachments)))

        # Update conversation updated_at timestamp
        cursor.execute(
            "UPDATE conversations SET updated_at = ? WHERE id = ?",
            (now, conv_id)
        )
        conn.commit()
        return {
            "id": msg_id,
            "conversation_id": conv_id,
            "sender": sender,
            "content": content,
            "created_at": now,
            "model": model,
            "attachments": attachments
        }

# --- Project operations ---

def get_projects() -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects ORDER BY updated_at DESC")
        projects = []
        for row in cursor.fetchall():
            p = dict(row)
            try:
                p["tags"] = json.loads(p.get("tags", "[]"))
            except Exception:
                p["tags"] = []
            projects.append(p)
        return projects

def create_project(proj_id: str, name: str, description: str, status: str, tags: list, github_url: str = "", live_url: str = "") -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        now = datetime.utcnow().isoformat()
        cursor.execute("""
            INSERT INTO projects (id, name, description, status, tags, github_url, live_url, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (proj_id, name, description, status, json.dumps(tags), github_url, live_url, now))
        conn.commit()
        return {
            "id": proj_id,
            "name": name,
            "description": description,
            "status": status,
            "tags": tags,
            "github_url": github_url,
            "live_url": live_url,
            "updated_at": now
        }

def update_project(proj_id: str, name: str, description: str, status: str, tags: list, github_url: str = "", live_url: str = "") -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        now = datetime.utcnow().isoformat()
        cursor.execute("""
            UPDATE projects
            SET name = ?, description = ?, status = ?, tags = ?, github_url = ?, live_url = ?, updated_at = ?
            WHERE id = ?
        """, (name, description, status, json.dumps(tags), github_url, live_url, now, proj_id))
        conn.commit()
        return cursor.rowcount > 0

def delete_project(proj_id: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM projects WHERE id = ?", (proj_id,))
        conn.commit()
        return cursor.rowcount > 0

# --- Memory operations ---

def get_memory_items() -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM memory_items ORDER BY updated_at DESC")
        return [dict(row) for row in cursor.fetchall()]

def add_memory_item(mem_id: str, key: str, value: str, category: str = "general") -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        now = datetime.utcnow().isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO memory_items (id, key, value, category, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (mem_id, key, value, category, now))
        conn.commit()
        return {"id": mem_id, "key": key, "value": value, "category": category, "updated_at": now}

def delete_memory_item(mem_id: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM memory_items WHERE id = ?", (mem_id,))
        conn.commit()
        return cursor.rowcount > 0

# Initialize database tables safely on import
try:
    init_db()
except Exception as e:
    print(f"Warning: Database initialization encountered an issue ({e}). App will continue with in-memory or fallback mode.")

