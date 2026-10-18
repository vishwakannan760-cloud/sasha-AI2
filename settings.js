/**
 * SASHA AI — Settings & Memory Management
 * ---------------------------------------
 * Handles API key configuration, theme selection, language preferences,
 * memory preferences, and conversation history data export.
 */

const SettingsHub = {
  activeTab: "ai",

  getConfig() {
    return {
      model: localStorage.getItem("sasha_model") || "sasha_demo",
      apiKey: localStorage.getItem("sasha_api_key") || "",
      language: localStorage.getItem("sasha_language") || "english",
      theme: localStorage.getItem("sasha_theme") || "dark-futuristic",
      userName: localStorage.getItem("sasha_user_name") || "Developer Learner",
      userRole: localStorage.getItem("sasha_user_role") || "Aspiring Python Full Stack Developer",
      memoryEnabled: localStorage.getItem("sasha_memory_enabled") !== "false"
    };
  },

  saveConfig(updates) {
    for (const [key, val] of Object.entries(updates)) {
      if (key === "model") localStorage.setItem("sasha_model", val);
      if (key === "apiKey") localStorage.setItem("sasha_api_key", val);
      if (key === "language") localStorage.setItem("sasha_language", val);
      if (key === "theme") localStorage.setItem("sasha_theme", val);
      if (key === "userName") localStorage.setItem("sasha_user_name", val);
      if (key === "userRole") localStorage.setItem("sasha_user_role", val);
      if (key === "memoryEnabled") localStorage.setItem("sasha_memory_enabled", val);
    }
  },

  async render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const config = this.getConfig();
    const memoryItems = await window.API.getMemory();

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <!-- Header -->
        <div class="border-b border-slate-800 pb-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Preferences
            </span>
            <span class="text-xs text-slate-400 font-medium tracking-wide uppercase">
              Application & AI Control
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Settings & Memory
          </h1>
          <p class="text-slate-400 text-sm mt-1">
            Configure your AI models, API keys, language styles, and personal memory profile.
          </p>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto text-xs font-medium">
          <button class="settings-nav-btn px-3.5 py-2 rounded-xl transition-all ${this.activeTab === 'ai' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'}" data-tab="ai">
            🤖 AI Engine & API
          </button>
          <button class="settings-nav-btn px-3.5 py-2 rounded-xl transition-all ${this.activeTab === 'memory' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'}" data-tab="memory">
            🧠 Memory & Preferences (${memoryItems.length})
          </button>
          <button class="settings-nav-btn px-3.5 py-2 rounded-xl transition-all ${this.activeTab === 'profile' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'}" data-tab="profile">
            👤 Developer Profile
          </button>
          <button class="settings-nav-btn px-3.5 py-2 rounded-xl transition-all ${this.activeTab === 'appearance' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'}" data-tab="appearance">
            🎨 Appearance
          </button>
          <button class="settings-nav-btn px-3.5 py-2 rounded-xl transition-all ${this.activeTab === 'about' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'}" data-tab="about">
            ℹ️ About SASHA AI
          </button>
        </div>

        <!-- Tab Content -->
        <div id="settingsTabContent">
          ${this.renderTabContent(this.activeTab, config, memoryItems)}
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.attachEvents();
  },

  renderTabContent(tab, config, memoryItems) {
    if (tab === "ai") {
      return `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 class="text-lg font-bold text-white mb-1">AI Model Engine</h2>
            <p class="text-xs text-slate-400">Select which brain SASHA uses to generate responses.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label class="cursor-pointer border rounded-xl p-4 flex flex-col justify-between transition-all ${config.model === 'sasha_demo' ? 'border-cyan-500 bg-cyan-950/20 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-cyan-400">SASHA Smart Engine</span>
                <input type="radio" name="aiModelRadio" value="sasha_demo" ${config.model === 'sasha_demo' ? 'checked' : ''} class="accent-cyan-400">
              </div>
              <p class="text-xs text-slate-300">Built-in intelligent demo & offline mode. Great for Python, full-stack, and Tanglish queries.</p>
              <span class="mt-3 text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400">Instant • Zero Setup</span>
            </label>

            <label class="cursor-pointer border rounded-xl p-4 flex flex-col justify-between transition-all ${config.model === 'gemini-1.5-flash' ? 'border-purple-500 bg-purple-950/20 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-purple-400">Google Gemini 1.5 Flash</span>
                <input type="radio" name="aiModelRadio" value="gemini-1.5-flash" ${config.model === 'gemini-1.5-flash' ? 'checked' : ''} class="accent-purple-400">
              </div>
              <p class="text-xs text-slate-300">Ultra-fast real cloud LLM from Google. Exceptional for coding, debugging, and everyday queries.</p>
              <span class="mt-3 text-[10px] uppercase font-mono font-bold tracking-wider text-purple-400">Cloud API</span>
            </label>

            <label class="cursor-pointer border rounded-xl p-4 flex flex-col justify-between transition-all ${config.model === 'gemini-1.5-pro' ? 'border-purple-500 bg-purple-950/20 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-purple-400">Google Gemini 1.5 Pro</span>
                <input type="radio" name="aiModelRadio" value="gemini-1.5-pro" ${config.model === 'gemini-1.5-pro' ? 'checked' : ''} class="accent-purple-400">
              </div>
              <p class="text-xs text-slate-300">Deep reasoning & complex code refactoring engine for large technical challenges.</p>
              <span class="mt-3 text-[10px] uppercase font-mono font-bold tracking-wider text-purple-400">High Reasoning</span>
            </label>
          </div>

          <!-- API Key Input -->
          <div class="pt-4 border-t border-slate-800/80 space-y-2">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Google Gemini API Key
            </label>
            <div class="flex items-center gap-2">
              <input type="password" id="geminiApiKeyInput" value="${config.apiKey}" placeholder="AIzaSy..." class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-400" />
              <button id="toggleKeyVisibility" class="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button id="saveApiKeyBtn" class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl transition-all">
                Save Key
              </button>
            </div>
            <p class="text-[11px] text-slate-400">
              Your API key is stored securely in your browser and sent only to your own server endpoint. You can obtain a free key at <a href="https://aistudio.google.com/" target="_blank" class="text-cyan-400 underline">Google AI Studio</a>.
            </p>
          </div>
        </div>
      `;
    }

    if (tab === "memory") {
      return `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-white mb-1">AI Memory & Preferences</h2>
              <p class="text-xs text-slate-400">Review, add, or delete personal preferences and context SASHA knows about you.</p>
            </div>
            <button id="addMemoryBtn" class="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all">
              <i data-lucide="plus" class="w-4 h-4"></i> Add Memory Note
            </button>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-300">Long-term AI Memory Active:</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="memoryToggle" ${config.memoryEnabled ? 'checked' : ''} class="sr-only peer">
              <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${memoryItems.length === 0 ? `
              <p class="col-span-full py-8 text-center text-xs text-slate-500">No memory items saved yet.</p>
            ` : memoryItems.map(m => `
              <div class="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">${m.key}</span>
                    <button class="del-mem-btn text-slate-500 hover:text-red-400 transition-colors" data-id="${m.id}">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                  <p class="text-sm text-slate-200 mt-1">${m.value}</p>
                </div>
                <span class="text-[10px] text-slate-500 mt-3 font-mono">Category: ${m.category || 'general'}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    if (tab === "profile") {
      return `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 class="text-lg font-bold text-white mb-1">Developer Profile</h2>
            <p class="text-xs text-slate-400">Personalize how SASHA addresses you and tailors coding advice.</p>
          </div>

          <form id="profileForm" class="space-y-4 max-w-lg">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
              <input type="text" id="profNameInput" value="${config.userName}" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400" />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Your Role / Aspiration</label>
              <input type="text" id="profRoleInput" value="${config.userRole}" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400" />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Preferred Language Style</label>
              <select id="profLangSelect" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400">
                <option value="english" ${config.language === 'english' ? 'selected' : ''}>English (Professional & Clear)</option>
                <option value="tanglish" ${config.language === 'tanglish' ? 'selected' : ''}>Tanglish (Tamil + English Blend)</option>
                <option value="tamil" ${config.language === 'tamil' ? 'selected' : ''}>Tamil (தமிழ்)</option>
              </select>
            </div>

            <button type="submit" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all">
              Save Profile
            </button>
          </form>
        </div>
      `;
    }

    if (tab === "appearance") {
      return `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 class="text-lg font-bold text-white mb-1">Appearance & Theme</h2>
            <p class="text-xs text-slate-400">Select your visual styling and futuristic color palette.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl border border-cyan-500/50 bg-[#07090e] cursor-pointer">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-white">Deep Futuristic Dark</span>
                <span class="w-3 h-3 rounded-full bg-cyan-400"></span>
              </div>
              <p class="text-xs text-slate-400">Electric blue and neon purple accents on deep black.</p>
            </div>

            <div class="p-4 rounded-xl border border-slate-800 bg-[#0a0f1d] opacity-75">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-white">Midnight Navy</span>
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              </div>
              <p class="text-xs text-slate-400">Deep oceanic navy tones with soft cyan highlights.</p>
            </div>
          </div>

          <!-- Data Controls -->
          <div class="pt-6 border-t border-slate-800 space-y-3">
            <h3 class="text-sm font-semibold text-white">Chat Data & Storage</h3>
            <div class="flex flex-wrap items-center gap-3">
              <button id="exportChatsBtn" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2 transition-all">
                <i data-lucide="download" class="w-4 h-4"></i> Export Conversations (JSON)
              </button>
              <button id="clearAllHistoryBtn" class="px-4 py-2 rounded-xl bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 text-xs font-medium text-red-300 flex items-center gap-2 transition-all">
                <i data-lucide="trash-2" class="w-4 h-4"></i> Clear All History
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (tab === "about") {
      return `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-600 to-indigo-600 p-0.5 shadow-xl shadow-purple-600/30">
              <div class="w-full h-full bg-[#0c1017] rounded-[14px] flex items-center justify-center">
                <i data-lucide="sparkles" class="w-7 h-7 text-cyan-400"></i>
              </div>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">SASHA AI</h2>
              <p class="text-xs text-cyan-400 font-mono">"Your AI. Your Companion. Your Future."</p>
              <span class="text-[11px] text-slate-500 font-mono">Version 1.0.0 • Python Full Stack</span>
            </div>
          </div>

          <div class="text-slate-300 text-sm leading-relaxed space-y-3">
            <p>
              <strong>SASHA AI</strong> was envisioned and built by an aspiring software engineer on the path to mastering Python Full Stack Development and technical English communication.
            </p>
            <p>
              Designed as a modern, friendly personal assistant, SASHA provides step-by-step guidance, code execution, multi-lingual support (English, Tamil, Tanglish), and developer project management.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div class="font-semibold text-slate-300">Privacy & Transparency Notice:</div>
            <p>• SASHA AI does not harvest your personal conversations or sell data.</p>
            <p>• When Demo Mode is active, responses are processed locally without cloud tracking.</p>
            <p>• When Gemini API is used, messages are transmitted securely via Google Generative AI API.</p>
          </div>
        </div>
      `;
    }
  },

  attachEvents() {
    // Tab switching
    document.querySelectorAll(".settings-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.render("mainViewContainer");
      });
    });

    // Model Radio
    document.querySelectorAll("input[name='aiModelRadio']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.saveConfig({ model: e.target.value });
        if (window.Chat) window.Chat.updateModelBadge();
      });
    });

    // Save API key
    const saveKeyBtn = document.getElementById("saveApiKeyBtn");
    const keyInput = document.getElementById("geminiApiKeyInput");
    if (saveKeyBtn && keyInput) {
      saveKeyBtn.addEventListener("click", () => {
        const key = keyInput.value.trim();
        this.saveConfig({ apiKey: key });
        saveKeyBtn.textContent = "Saved! ✓";
        setTimeout(() => saveKeyBtn.textContent = "Save Key", 2000);
      });
    }

    // Toggle key visibility
    const toggleBtn = document.getElementById("toggleKeyVisibility");
    if (toggleBtn && keyInput) {
      toggleBtn.addEventListener("click", () => {
        keyInput.type = keyInput.type === "password" ? "text" : "password";
      });
    }

    // Memory toggle
    const memToggle = document.getElementById("memoryToggle");
    if (memToggle) {
      memToggle.addEventListener("change", (e) => {
        this.saveConfig({ memoryEnabled: e.target.checked });
      });
    }

    // Delete memory item
    document.querySelectorAll(".del-mem-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Delete this memory fact?")) {
          await window.API.deleteMemory(id);
          this.render("mainViewContainer");
        }
      });
    });

    // Add memory note prompt
    const addMemBtn = document.getElementById("addMemoryBtn");
    if (addMemBtn) {
      addMemBtn.addEventListener("click", async () => {
        const key = prompt("Enter Memory Category / Title (e.g. 'Favorite Framework', 'Coding Goal'):");
        if (!key) return;
        const val = prompt(`Enter details for '${key}':`);
        if (!val) return;
        await window.API.addMemory(key, val, "user-custom");
        this.render("mainViewContainer");
      });
    }

    // Profile form
    const profForm = document.getElementById("profileForm");
    if (profForm) {
      profForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userName = document.getElementById("profNameInput").value.trim();
        const userRole = document.getElementById("profRoleInput").value.trim();
        const language = document.getElementById("profLangSelect").value;
        this.saveConfig({ userName, userRole, language });
        if (window.App) window.App.updateUserProfileDisplay();
        alert("Profile saved successfully!");
      });
    }

    // Export chats
    const exportBtn = document.getElementById("exportChatsBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", async () => {
        const convs = await window.API.getConversations();
        const blob = new Blob([JSON.stringify(convs, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sasha_ai_chats_${Date.now()}.json`;
        a.click();
      });
    }

    // Clear history
    const clearBtn = document.getElementById("clearAllHistoryBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", async () => {
        if (confirm("Warning: This will clear all stored conversation history. Proceed?")) {
          const convs = await window.API.getConversations();
          for (const c of convs) {
            await window.API.deleteConversation(c.id);
          }
          if (window.Chat) await window.Chat.loadConversations();
          alert("All conversation history cleared.");
        }
      });
    }
  }
};

window.SettingsHub = SettingsHub;
