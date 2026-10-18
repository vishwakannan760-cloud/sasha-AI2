"""
SASHA AI — One-Click Python Launcher
------------------------------------
Starts the SASHA AI FastAPI backend server and opens the application
in your default web browser automatically.

Usage:
    python run.py
"""

import sys
import os
import webbrowser
import threading
import time

def open_browser():
    """Waits 1.2 seconds for the server to bind, then launches the browser."""
    time.sleep(1.2)
    url = "http://127.0.0.1:8000"
    print(f"\n🚀 Opening SASHA AI in your web browser: {url}")
    webbrowser.open(url)

def main():
    print("=" * 60)
    print("  ✨ SASHA AI — Your AI. Your Companion. Your Future. ✨")
    print("=" * 60)
    print("• Initializing SQLite database...")
    
    from backend import database
    database.init_db()
    print("• SQLite Database ready: data/sasha_ai.db")

    print("• Starting FastAPI & Uvicorn server on http://127.0.0.1:8000 ...")
    
    # Launch browser in a background thread
    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    uvicorn.run("backend.app:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
