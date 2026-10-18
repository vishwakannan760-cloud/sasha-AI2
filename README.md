# 🌟 SASHA AI — My Personal AI Chat Assistant

> **Tagline:** *"Your AI. Your Companion. Your Future."*  
> **Built for:** Python Full Stack Learner • IT Career Growth • Everyday Productivity

---

## 🎯 About The Project

**SASHA AI** is a modern, futuristic, full-stack AI assistant and companion built for developers and learners. It is designed to be friendly, patient, supportive, and intelligent—explaining technical concepts step-by-step, helping with daily coding, and supporting multi-lingual conversation (**English, Tamil, and Tanglish**).

---

## 🚀 Key Features

### 1. 💬 Modern Futuristic AI Chat
- **Futuristic Dark Aesthetic:** Deep black and dark navy backgrounds with electric cyan (`#00d2ff`) and neon purple (`#a855f7`) glow accents.
- **Hero Welcome Screen:** Glowing AI cosmic emblem, welcome heading, and 4 quick-prompt cards:
  - *Help me learn Python*
  - *Teach me English*
  - *Explain an AI concept*
  - *Help me build a website*
- **Rich Markdown & Code Display:** Syntax-highlighted code blocks with one-click **"Copy Code"** button.
- **Audio & Accessibility:**
  - 🎙️ **Voice Input (Speech-to-Text):** Speak directly to SASHA using your microphone.
  - 🔊 **Read Aloud (Text-to-Speech):** Listen to SASHA's explanations.
- **📎 Code & File Attachments:** Attach Python (`.py`), JavaScript, HTML, CSS, or text files directly to your conversation.
- **Response Actions:** Copy responses, retry/regenerate, and clear error notifications.

### 2. 🎓 Personal Learning Assistant Hub
A structured curriculum covering essential Python Full Stack & IT skills:
1. Python Fundamentals & Variables
2. Lists, Tuples, Dictionaries & Sets
3. Conditionals & Loops
4. Functions & Clean Code
5. Object-Oriented Programming (OOP)
6. HTML5, CSS3 & JavaScript
7. Backend Development with FastAPI
8. Databases & SQLite
9. REST APIs & Architecture
10. AI, LLMs & Prompt Engineering
11. English Communication for IT Interviews (STAR method & daily standups)

**Interactive Learning Features:**
- **Interactive Code Playground:** Edit Python code directly in your browser and run it live on your local Python runtime!
- **Interactive Quizzes:** Test your understanding with instant feedback and explanations.
- **"Ask SASHA" Integration:** One-click launch into an interactive coaching conversation with SASHA.

### 3. 🚀 "My Projects" Workspace
Manage your personal development projects:
- Pre-loaded with:
  - **SASHA AI** (AI Assistant Web App)
  - **Personal Portfolio Website**
  - **Python Practice Projects**
  - **Future AI Experiments**
- Add, edit, filter (All, In Progress, Planning, Completed), and delete projects.
- **"Consult SASHA" button:** Launches a tailored chat to brainstorm architecture, debug code, or plan next steps.
- Stored persistently in SQLite (`data/sasha_ai.db`).

### 4. 🧠 Long-Term Memory & User Preferences
- Dedicated user preference manager.
- Stores developer profile (Name, Role, Goals), preferred language style (English, Tamil, Tanglish).
- Full user control: View, add, and delete saved memory notes anytime.

### 5. 🤖 Dual AI Engine Integration
- **Default Mode (Demo / Offline):** Smart built-in SASHA Engine that answers programming questions, explains concepts, and speaks English, Tamil, and Tanglish out of the box without requiring external API keys.
- **Real Cloud LLM Mode:** Connects to **Google Gemini 1.5 Flash** or **Gemini 1.5 Pro** securely through the backend.
  - Add your API key in **Settings ⚙️** or in `.env` (`GEMINI_API_KEY`).
  - Keys are never exposed publicly.

---

## 🏗️ Project Architecture

```
c:\Users\acer\Downloads\google\
│
├── backend/                       # Python Backend (FastAPI)
│   ├── app.py                    # Main FastAPI app & REST endpoints
│   ├── ai_service.py             # SASHA AI brain, Gemini integration, Tamil/Tanglish logic
│   ├── database.py               # SQLite database models & persistence
│   ├── code_runner.py            # Safe Python code execution sandbox
│   └── __init__.py
│
├── static/                        # Frontend UI (HTML5, Tailwind, JS)
│   ├── index.html                # Single-page web application
│   ├── css/
│   │   └── custom.css            # Futuristic neon glows, animations, glassmorphism
│   └── js/
│       ├── api.js                # Client API interface with offline fallback
│       ├── chat.js               # Chat messaging, speech-to-text, attachments
│       ├── learning.js           # Learning Assistant curriculum, quizzes, code runner
│       ├── projects.js           # "My Projects" workspace CRUD manager
│       ├── settings.js           # Settings, API key manager, Memory controls
│       └── app.js                # View router and sidebar coordinator
│
├── data/
│   └── sasha_ai.db               # SQLite database file (auto-generated)
│
├── run.py                        # One-click Python launcher with auto browser open
├── start_sasha.bat               # Windows batch launcher (double-click to run)
├── requirements.txt              # Python dependencies (FastAPI, Uvicorn, Requests)
└── .env.example                  # Environment configuration template
```

---

## ⚡ How to Run Locally

### Option 1: Double-Click (Easiest)
Simply double-click:
```bat
start_sasha.bat
```
This starts the backend server and opens your web browser to `http://127.0.0.1:8000`.

### Option 2: Terminal / PowerShell
```powershell
python run.py
```
Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

---

## 🔑 How to Connect Real Google Gemini AI (Free)

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Open SASHA AI in your browser.
3. Click **Settings ⚙️** in the bottom left sidebar.
4. Paste your API key into the **Google Gemini API Key** field and click **Save Key**.
5. Select **Google Gemini 1.5 Flash** or **Gemini 1.5 Pro**!
6. Alternatively, add it to your server `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_gemini_key_here
   ```

---

## 🌐 Deployment Guide (Publishing Online)

To publish SASHA AI online so anyone can access it:

### Deploying to Render.com (Recommended Free Tier)
1. Push your project code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SASHA AI"
   git push origin main
   ```
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the following build settings:
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
5. Add an Environment Variable (optional):
   - Key: `GEMINI_API_KEY`, Value: *Your Gemini API Key*
6. Click **Deploy Web Service**. Render will generate a live public URL (e.g., `https://sasha-ai.onrender.com`)!

---

## 💡 Developer Reflection & Future Roadmap

As you continue your Python Full Stack journey:
- **Phase 1 (Completed):** Responsive dark futuristic UI, chat interactions, persistent SQLite storage, Learning Assistant, My Projects workspace, voice input/output.
- **Phase 2 (Next Steps):** User authentication (Sign up / Login with JWT or Supabase), AI memory auto-summarization, and code editor enhancements.

Enjoy building with SASHA AI! 🚀
