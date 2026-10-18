/**
 * SASHA AI — Learning Assistant Hub
 * ---------------------------------
 * Interactive curriculum for Python Full Stack Development & IT English.
 * Includes lessons, code playground with live execution, and interactive quizzes.
 */

const LEARNING_MODULES = [
  {
    id: "python-fundamentals",
    title: "1. Python Fundamentals & Variables",
    badge: "Core Basics",
    category: "Python",
    description: "Understand variables as named containers for data, dynamic typing, and basic input/output operations.",
    analogy: "Think of variables like labeled boxes in your room. If you label a box 'shoes', you can place sneakers inside. Later, you can swap them for sandals without changing the box label!",
    code: `# Storing information in variables
student_name = "Alex"
current_year = 2026
learning_hours_per_day = 2.5
is_enrolled = True

# Displaying formatted output using f-strings
print(f"Student: {student_name}")
print(f"Year: {current_year}")
print(f"Target Hours: {learning_hours_per_day} hrs/day")
print(f"Active Status: {is_enrolled}")`,
    quiz: {
      question: "Which of the following creates a valid string variable in Python?",
      options: [
        "name = \"SASHA AI\"",
        "var name := \"SASHA AI\"",
        "string name = \"SASHA AI\";",
        "let name = 'SASHA AI'"
      ],
      correctIndex: 0,
      explanation: "In Python, you do not declare data types explicitly. Simply write variable_name = 'value'!"
    },
    sashaPrompt: "Hey SASHA, can you explain Python variables and data types to me with three simple real-world examples?"
  },
  {
    id: "data-structures",
    title: "2. Lists, Tuples, Dictionaries & Sets",
    badge: "Data Collections",
    category: "Python",
    description: "Learn how to store multiple pieces of data efficiently using Python's four built-in collection types.",
    analogy: "A List is a grocery list you can edit anytime. A Tuple is a printed recipe that never changes. A Dictionary is a phone book where a person's name maps to their number. A Set is a bag of unique marbles with no duplicates!",
    code: `# 1. List (Ordered, Mutable)
tech_stack = ["HTML", "CSS", "Python"]
tech_stack.append("FastAPI")

# 2. Dictionary (Key-Value Pairs)
developer = {
    "name": "Alex",
    "role": "Full Stack Learner",
    "skills": tech_stack
}

# 3. Tuple (Immutable)
screen_dimensions = (1920, 1080)

# 4. Set (Unique items only)
unique_skills = set(["Python", "JavaScript", "Python"])

print("Tech Stack List:", tech_stack)
print("Developer Role:", developer["role"])
print("Unique Skills Set:", unique_skills)`,
    quiz: {
      question: "Which data structure in Python does NOT allow duplicate values?",
      options: ["List", "Dictionary", "Set", "Tuple"],
      correctIndex: 2,
      explanation: "A Set automatically discards duplicate entries and keeps only unique items!"
    },
    sashaPrompt: "Hey SASHA, can you explain the difference between a Python List and a Dictionary with code examples?"
  },
  {
    id: "flow-control",
    title: "3. Conditionals & Loops",
    badge: "Control Flow",
    category: "Python",
    description: "Master making decisions with if-elif-else statements and repeating tasks with for and while loops.",
    analogy: "Conditionals are like traffic lights (if green, go; if red, stop). Loops are like a music playlist on repeat—playing song after song until the playlist ends!",
    code: `# If-Elif-Else Conditionals
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"

print(f"Score {score} qualifies for Grade: {grade}")

# For Loop with range
print("\\nCountdown to Launch:")
for i in range(3, 0, -1):
    print(f"T-minus {i}...")
print("🚀 SASHA AI is Online!")`,
    quiz: {
      question: "What keyword is used in Python to handle multiple alternative conditions after an 'if'?",
      options: ["else if", "elif", "case", "when"],
      correctIndex: 1,
      explanation: "Python uses 'elif', which is a short form of 'else if'!"
    },
    sashaPrompt: "Hey SASHA, can you teach me how 'for' loops and 'while' loops work in Python with beginner exercises?"
  },
  {
    id: "functions-modules",
    title: "4. Functions & Clean Code",
    badge: "Modular Programming",
    category: "Python",
    description: "Write reusable functions using the def keyword, parameters, default arguments, and return values.",
    analogy: "A function is like a coffee vending machine. You give it beans and water (arguments), it runs internal steps, and hands you a hot espresso (return value)!",
    code: `# Defining a reusable function
def calculate_project_progress(completed_tasks, total_tasks):
    """Calculates percentage completion of a project."""
    if total_tasks == 0:
        return 0.0
    percentage = (completed_tasks / total_tasks) * 100
    return round(percentage, 1)

# Calling the function
sasha_progress = calculate_project_progress(4, 6)
print(f"SASHA AI Project Completion: {sasha_progress}%")`,
    quiz: {
      question: "Which keyword is used to return a result from a function in Python?",
      options: ["send", "output", "return", "yield"],
      correctIndex: 2,
      explanation: "The 'return' keyword exits the function and passes the calculated value back to the caller."
    },
    sashaPrompt: "Hey SASHA, can you show me how to write clean functions with parameters and return values in Python?"
  },
  {
    id: "oop-python",
    title: "5. Object-Oriented Programming (OOP)",
    badge: "Software Architecture",
    category: "Python",
    description: "Understand Classes, Objects, the __init__ constructor, methods, and inheritance.",
    analogy: "A Class is an architectural blueprint for a house. An Object is the actual house built from that blueprint. You can build 50 different houses from one single blueprint!",
    code: `class Assistant:
    def __init__(self, name, version):
        self.name = name
        self.version = version
        self.is_active = True

    def introduce(self):
        return f"Hello! I am {self.name} v{self.version}. How can I assist your coding today?"

# Creating an instance (object)
sasha = Assistant("SASHA AI", "1.0")
print(sasha.introduce())`,
    quiz: {
      question: "What is the special constructor method name called when an object is initialized in Python?",
      options: ["__start__", "__init__", "__new__", "constructor"],
      correctIndex: 1,
      explanation: "In Python classes, '__init__' is the constructor method invoked when creating a new instance."
    },
    sashaPrompt: "Hey SASHA, can you explain Object-Oriented Programming (Classes and Objects) in Python in simple words?"
  },
  {
    id: "web-frontend",
    title: "6. HTML5, CSS3 & JavaScript",
    badge: "Frontend Layer",
    category: "Web",
    description: "Understand the three foundational pillars of every web interface: structure, design, and interactivity.",
    analogy: "HTML is the skeleton (bones and structure). CSS is the skin, hair, and clothing (colors and styling). JavaScript is the nervous system (movement, clicks, and interactivity)!",
    code: `# Conceptual web layout representation
html_structure = """
<div class="chat-container">
  <h2 class="title">SASHA AI Chat</h2>
  <button id="sendBtn">Send Message</button>
</div>
"""
print("Web Frontend Stack:")
print("- HTML5: Semantics, accessibility & structure")
print("- CSS3: Flexbox, Grid, animations & dark themes")
print("- JavaScript: Event listeners, fetch API & DOM updates")`,
    quiz: {
      question: "Which technology is responsible for making web pages interactive when a user clicks a button?",
      options: ["HTML", "CSS", "JavaScript", "SQL"],
      correctIndex: 2,
      explanation: "JavaScript listens to user events like clicks and keystrokes and updates the page dynamically!"
    },
    sashaPrompt: "Hey SASHA, can you explain how HTML, CSS, and JavaScript work together to build a modern website?"
  },
  {
    id: "backend-fastapi",
    title: "7. Backend Development with FastAPI",
    badge: "Server Architecture",
    category: "Backend",
    description: "Learn how web servers listen for HTTP requests, process data, and return JSON responses.",
    analogy: "The backend is like a restaurant kitchen. The customer (browser) places an order from the menu (API route), the chef (Python backend) prepares the dish, and the waiter serves it back!",
    code: `# FastAPI REST Endpoint Example
# from fastapi import FastAPI
# app = FastAPI()

# @app.get("/api/greet")
# def greet(name: str = "Developer"):
#     return {"message": f"Hello {name}, welcome to backend engineering!"}

print("FastAPI Highlights:")
print("1. Automatic interactive Swagger documentation at /docs")
print("2. Pydantic data validation and auto-serialization")
print("3. Asynchronous performance powered by Starlette & Uvicorn")`,
    quiz: {
      question: "What HTTP method is typically used to submit new data (like a chat message) to a server?",
      options: ["GET", "POST", "DELETE", "HEAD"],
      correctIndex: 1,
      explanation: "POST is the standard HTTP method used to send new payloads and records to a web server."
    },
    sashaPrompt: "Hey SASHA, can you teach me how a FastAPI backend works and how to create my first API route?"
  },
  {
    id: "databases-sql",
    title: "8. Databases & SQLite",
    badge: "Data Persistence",
    category: "Database",
    description: "Learn how relational databases store data permanently using tables, rows, columns, and SQL queries.",
    analogy: "A database is like an ultra-fast, organized digital filing cabinet with strict folder structures. Even when your computer turns off, all data remains safely stored!",
    code: `# SQL query examples used in SASHA AI
sql_create_table = """
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender TEXT,
    content TEXT,
    created_at TIMESTAMP
);
"""

sql_insert = "INSERT INTO messages (id, sender, content) VALUES ('1', 'user', 'Hello');"
sql_select = "SELECT * FROM messages WHERE sender = 'user' ORDER BY created_at DESC;"

print("SQL Core Operations (CRUD):")
print("- Create: INSERT INTO table ...")
print("- Read:   SELECT * FROM table ...")
print("- Update: UPDATE table SET ...")
print("- Delete: DELETE FROM table WHERE ...")`,
    quiz: {
      question: "Which SQL command is used to retrieve data from a database table?",
      options: ["FETCH", "GET", "SELECT", "FIND"],
      correctIndex: 2,
      explanation: "The 'SELECT' command is the SQL standard for reading and querying rows from a table."
    },
    sashaPrompt: "Hey SASHA, can you explain SQL basics (CRUD operations) and how SQLite connects with Python?"
  },
  {
    id: "rest-apis",
    title: "9. REST APIs & Client-Server Architecture",
    badge: "API Engineering",
    category: "Backend",
    description: "Understand endpoints, HTTP status codes (200, 404, 500), headers, and JSON data formats.",
    analogy: "A REST API is like an electrical socket in your wall. Any appliance with the right plug (HTTP request) can draw power (data), regardless of what brand it is!",
    code: `# Example JSON API Response payload
import json

api_response = {
    "status": 200,
    "success": True,
    "data": {
        "assistant": "SASHA AI",
        "tagline": "Your AI. Your Companion. Your Future."
    }
}

json_string = json.dumps(api_response, indent=2)
print("Standard JSON API Payload:\\n", json_string)`,
    quiz: {
      question: "What HTTP status code represents a successful request?",
      options: ["404", "500", "200", "301"],
      correctIndex: 2,
      explanation: "HTTP 200 OK indicates that the request has succeeded."
    },
    sashaPrompt: "Hey SASHA, can you explain how REST APIs and JSON work between a frontend and a backend?"
  },
  {
    id: "ai-llms",
    title: "10. AI, LLMs & Prompt Engineering",
    badge: "Artificial Intelligence",
    category: "AI",
    description: "Discover how Large Language Models generate text, how tokens and embeddings work, and how to write effective prompts.",
    analogy: "An LLM is like a master musician who has heard every song ever written. Given the first few opening notes (your prompt), it can improvise the rest of the symphony seamlessly!",
    code: `# Prompt Engineering Template
system_role = "Expert Python Full Stack Tutor"
user_question = "Explain recursion simply"

prompt = f"""You are a {system_role}.
Question: {user_question}
Requirements:
1. Explain in 3 simple bullet points.
2. Provide a 5-line Python example.
"""
print("Engineered Prompt:\\n" + prompt)`,
    quiz: {
      question: "What parameter in LLMs controls the randomness and creativity of the output?",
      options: ["Frequency Penalty", "Temperature", "Top-K", "Max Length"],
      correctIndex: 1,
      explanation: "Temperature controls randomness: 0.0 is deterministic and focused; higher values increase variety."
    },
    sashaPrompt: "Hey SASHA, can you explain how Large Language Models work and how to write great prompts?"
  },
  {
    id: "it-english",
    title: "11. English Communication for IT Interviews",
    badge: "Career & Communication",
    category: "Career",
    description: "Build confidence for technical interviews, self-introductions, agile daily standups, and explaining project architecture.",
    analogy: "Speaking in an interview is like telling a hero's story: Start with the challenge (Situation), describe your mission (Task), show what you built (Action), and celebrate the impact (Result)!",
    code: `# Daily Standup Template in Agile IT Teams
yesterday = "Completed the SQLite database schema and chat API endpoints."
today = "Working on frontend responsive styling with Tailwind and the code runner."
blockers = "No blockers at the moment. Everything is on track."

standup_speech = f"""Hi team, here is my daily update:
1. Yesterday: {yesterday}
2. Today: {today}
3. Blockers: {blockers}"""

print(standup_speech)`,
    quiz: {
      question: "What does the 'STAR' technique stand for when answering behavioral interview questions?",
      options: [
        "Situation, Task, Action, Result",
        "System, Testing, Analysis, Release",
        "Start, Talk, Ask, Repeat",
        "Strategy, Tools, Architecture, Review"
      ],
      correctIndex: 0,
      explanation: "STAR stands for Situation, Task, Action, and Result—the gold standard for interview storytelling!"
    },
    sashaPrompt: "Hey SASHA, can we do a mock IT interview? Please ask me 'Tell me about yourself' and give me feedback on my answer."
  }
];

const LearningHub = {
  currentModuleIndex: 0,

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const module = LEARNING_MODULES[this.currentModuleIndex];

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                ${module.badge}
              </span>
              <span class="text-xs text-slate-400 font-medium tracking-wide uppercase">
                ${module.category}
              </span>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
              ${module.title}
            </h1>
          </div>

          <!-- Module Selector -->
          <div class="flex items-center gap-2">
            <select id="moduleSelect" class="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400">
              ${LEARNING_MODULES.map((m, idx) => `
                <option value="${idx}" ${idx === this.currentModuleIndex ? "selected" : ""}>
                  ${m.title}
                </option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Concept Overview Card -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h2 class="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <i data-lucide="book-open" class="w-5 h-5"></i> Concept Breakdown
          </h2>
          <p class="text-slate-300 leading-relaxed text-sm md:text-base">
            ${module.description}
          </p>
          <div class="bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
            <i data-lucide="lightbulb" class="w-5 h-5 text-purple-400 shrink-0 mt-0.5"></i>
            <div>
              <span class="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">Beginner Analogy</span>
              <p class="text-sm text-purple-200/90 leading-relaxed">${module.analogy}</p>
            </div>
          </div>
        </div>

        <!-- Interactive Code Runner Section -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <i data-lucide="terminal" class="w-5 h-5 text-cyan-400"></i> Interactive Python Playground
            </h2>
            <button id="runCodeBtn" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-200 active:scale-95">
              <i data-lucide="play" class="w-4 h-4 fill-current"></i> Run Code
            </button>
          </div>
          
          <div class="rounded-xl overflow-hidden border border-slate-800 bg-[#090d16]">
            <div class="flex items-center justify-between px-4 py-2 bg-[#0d1320] border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>main.py</span>
              <span class="text-[11px] text-cyan-400">Python 3.15</span>
            </div>
            <textarea id="codeEditor" rows="9" class="w-full bg-transparent p-4 font-mono text-sm text-slate-200 focus:outline-none resize-y">${module.code}</textarea>
          </div>

          <!-- Output Console -->
          <div id="outputConsoleWrapper" class="hidden">
            <span class="text-xs font-mono text-slate-400 block mb-1">Terminal Output:</span>
            <pre id="outputConsole" class="bg-black/80 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap"></pre>
          </div>
        </div>

        <!-- Interactive Practice Quiz -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <i data-lucide="help-circle" class="w-5 h-5 text-purple-400"></i> Knowledge Check Quiz
          </h2>
          <p class="text-slate-200 text-sm font-medium">
            ${module.quiz.question}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="quizOptions">
            ${module.quiz.options.map((opt, i) => `
              <button class="quiz-option text-left px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-sm text-slate-300 transition-all" data-index="${i}">
                <span class="font-mono text-xs text-slate-500 mr-2">${String.fromCharCode(65 + i)}.</span> ${opt}
              </button>
            `).join("")}
          </div>
          <div id="quizResult" class="hidden text-sm p-4 rounded-xl border"></div>
        </div>

        <!-- Action footer: Ask SASHA -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-cyan-950/30 border border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white">Have questions about this topic?</h3>
              <p class="text-xs text-slate-400">SASHA is ready to explain in English, Tamil, or Tanglish.</p>
            </div>
          </div>
          <button id="askSashaBtn" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all">
            <i data-lucide="message-square" class="w-4 h-4"></i> Ask SASHA About This
          </button>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.attachEvents();
  },

  attachEvents() {
    // Module selector change
    const sel = document.getElementById("moduleSelect");
    if (sel) {
      sel.addEventListener("change", (e) => {
        this.currentModuleIndex = parseInt(e.target.value, 10);
        this.render("mainViewContainer");
      });
    }

    // Run Code button
    const runBtn = document.getElementById("runCodeBtn");
    if (runBtn) {
      runBtn.addEventListener("click", async () => {
        const editor = document.getElementById("codeEditor");
        const consoleWrapper = document.getElementById("outputConsoleWrapper");
        const consoleEl = document.getElementById("outputConsole");
        if (!editor || !consoleEl) return;

        const code = editor.value;
        runBtn.disabled = true;
        runBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Running...`;
        if (window.lucide) window.lucide.createIcons();

        consoleWrapper.classList.remove("hidden");
        consoleEl.textContent = "Executing code on Python 3.15 runtime...\n";

        try {
          const res = await window.API.runCode(code);
          if (res.success) {
            consoleEl.className = "bg-black/90 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap";
            consoleEl.textContent = res.stdout || "(Process finished with return code 0, no output)";
          } else {
            consoleEl.className = "bg-black/90 text-red-400 p-4 rounded-xl border border-red-500/20 font-mono text-xs overflow-x-auto whitespace-pre-wrap";
            consoleEl.textContent = res.stderr || res.stdout || "Error during execution.";
          }
        } catch (err) {
          consoleEl.textContent = `Client error: ${err.message}`;
        } finally {
          runBtn.disabled = false;
          runBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-current"></i> Run Code`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // Quiz options
    const options = document.querySelectorAll(".quiz-option");
    const resultBox = document.getElementById("quizResult");
    const module = LEARNING_MODULES[this.currentModuleIndex];

    options.forEach((optBtn) => {
      optBtn.addEventListener("click", () => {
        const chosen = parseInt(optBtn.getAttribute("data-index"), 10);
        options.forEach(b => b.disabled = true);

        resultBox.classList.remove("hidden");
        if (chosen === module.quiz.correctIndex) {
          optBtn.classList.add("border-emerald-500", "bg-emerald-950/40", "text-emerald-300");
          resultBox.className = "text-sm p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300";
          resultBox.innerHTML = `<strong>✨ Correct!</strong> ${module.quiz.explanation}`;
        } else {
          optBtn.classList.add("border-red-500", "bg-red-950/40", "text-red-300");
          const correctBtn = document.querySelector(`.quiz-option[data-index="${module.quiz.correctIndex}"]`);
          if (correctBtn) {
            correctBtn.classList.add("border-emerald-500", "bg-emerald-950/30", "text-emerald-300");
          }
          resultBox.className = "text-sm p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300";
          resultBox.innerHTML = `<strong>Not quite.</strong> ${module.quiz.explanation}`;
        }
      });
    });

    // Ask SASHA button
    const askBtn = document.getElementById("askSashaBtn");
    if (askBtn) {
      askBtn.addEventListener("click", () => {
        if (window.App) {
          window.App.switchView("chat");
          window.Chat.prefillAndSend(module.sashaPrompt);
        }
      });
    }
  }
};

window.LearningHub = LearningHub;
