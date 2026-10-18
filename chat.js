/**
 * SASHA AI — Chat Controller & Message Flow
 * -----------------------------------------
 * Handles real-time chat interactions, conversation persistence,
 * markdown parsing with code copying, voice transcription, file attachments,
 * and text-to-speech reading.
 */

const Chat = {
  activeConversationId: null,
  conversations: [],
  messages: [],
  isGenerating: false,
  attachedFiles: [],
  speechRecognition: null,
  isListening: false,

  async init() {
    this.setupSpeechRecognition();
    await this.loadConversations();
    this.updateModelBadge();
  },

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const input = document.getElementById("chatInput");
        if (input) {
          input.value = transcript;
          this.autoResizeTextarea(input);
          this.updateSendButtonState();
        }
      };

      this.speechRecognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.stopListening();
      };

      this.speechRecognition.onend = () => {
        this.stopListening();
      };
    }
  },

  toggleSpeech() {
    if (!this.speechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  },

  startListening() {
    if (!this.speechRecognition) return;
    try {
      this.speechRecognition.start();
      this.isListening = true;
      const micBtn = document.getElementById("micBtn");
      if (micBtn) {
        micBtn.classList.add("recording-active");
        micBtn.title = "Listening... Click to stop";
      }
    } catch (e) {
      console.warn("Speech start error:", e);
    }
  },

  stopListening() {
    if (!this.speechRecognition) return;
    try {
      this.speechRecognition.stop();
    } catch (e) {}
    this.isListening = false;
    const micBtn = document.getElementById("micBtn");
    if (micBtn) {
      micBtn.classList.remove("recording-active");
      micBtn.title = "Voice Input";
    }
  },

  async loadConversations() {
    this.conversations = await window.API.getConversations();
    this.renderSidebarHistory();
  },

  renderSidebarHistory(searchTerm = "") {
    const historyContainer = document.getElementById("conversationList");
    if (!historyContainer) return;

    let filtered = this.conversations;
    if (searchTerm.trim()) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filtered.length === 0) {
      historyContainer.innerHTML = `
        <div class="py-8 text-center text-xs text-slate-500">
          ${searchTerm ? "No matching chats found." : "No previous chats yet."}
        </div>
      `;
      return;
    }

    historyContainer.innerHTML = filtered.map(c => {
      const isActive = c.id === this.activeConversationId;
      return `
        <div class="group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${isActive ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'}" data-conv-id="${c.id}">
          <div class="flex items-center gap-2.5 overflow-hidden flex-1 select-conv-btn" data-conv-id="${c.id}">
            <i data-lucide="message-square" class="w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}"></i>
            <span class="truncate font-medium">${this.escapeHtml(c.title)}</span>
          </div>

          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button class="rename-conv-btn p-1 text-slate-500 hover:text-white rounded" data-conv-id="${c.id}" title="Rename">
              <i data-lucide="edit-2" class="w-3 h-3"></i>
            </button>
            <button class="delete-conv-btn p-1 text-slate-500 hover:text-red-400 rounded" data-conv-id="${c.id}" title="Delete">
              <i data-lucide="trash-2" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach click events
    historyContainer.querySelectorAll(".select-conv-btn").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-conv-id");
        this.selectConversation(id);
      });
    });

    historyContainer.querySelectorAll(".rename-conv-btn").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = el.getAttribute("data-conv-id");
        this.promptRenameConversation(id);
      });
    });

    historyContainer.querySelectorAll(".delete-conv-btn").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = el.getAttribute("data-conv-id");
        this.deleteConversation(id);
      });
    });
  },

  async startNewChat() {
    this.activeConversationId = null;
    this.messages = [];
    this.attachedFiles = [];
    this.renderAttachmentBadges();
    this.renderChatMessages();
    this.renderSidebarHistory();
    const input = document.getElementById("chatInput");
    if (input) {
      input.value = "";
      input.focus();
    }
  },

  async selectConversation(convId) {
    this.activeConversationId = convId;
    this.renderSidebarHistory();
    this.messages = await window.API.getMessages(convId);
    this.renderChatMessages();
    
    // Close mobile sidebar if open
    const sidebar = document.getElementById("sidebar");
    if (sidebar && !sidebar.classList.contains("-translate-x-full") && window.innerWidth < 768) {
      sidebar.classList.add("-translate-x-full");
    }
  },

  async promptRenameConversation(convId) {
    const conv = this.conversations.find(c => c.id === convId);
    if (!conv) return;
    const newTitle = prompt("Rename conversation:", conv.title);
    if (newTitle && newTitle.trim() && newTitle.trim() !== conv.title) {
      await window.API.renameConversation(convId, newTitle.trim());
      await this.loadConversations();
    }
  },

  async deleteConversation(convId) {
    if (confirm("Are you sure you want to delete this conversation?")) {
      await window.API.deleteConversation(convId);
      if (this.activeConversationId === convId) {
        this.startNewChat();
      } else {
        await this.loadConversations();
      }
    }
  },

  renderChatMessages() {
    const container = document.getElementById("chatMessagesContainer");
    if (!container) return;

    if (!this.messages || this.messages.length === 0) {
      container.innerHTML = this.renderWelcomeHero();
      this.attachHeroPromptEvents();
    } else {
      container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
          ${this.messages.map(m => this.renderMessageBubble(m)).join("")}
          ${this.isGenerating ? this.renderThinkingIndicator() : ""}
        </div>
      `;
      this.attachMessageActions();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.scrollToBottom();
  },

  renderWelcomeHero() {
    return `
      <div class="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none overflow-hidden">
        <!-- Ambient Glowing Sphere -->
        <div class="hero-glow-sphere"></div>

        <!-- Glowing Star Emblem (Inspired by Screenshot) -->
        <div class="relative z-10 mb-6">
          <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-2xl shadow-purple-600/40 animate-float">
            <div class="w-full h-full bg-[#0a0d14] rounded-[22px] flex items-center justify-center">
              <i data-lucide="sparkles" class="w-8 h-8 text-cyan-400"></i>
            </div>
          </div>
        </div>

        <!-- Title & Subtitle -->
        <h1 class="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3 max-w-2xl">
          How can I help you today?
        </h1>
        <p class="relative z-10 text-sm md:text-base text-slate-400 max-w-xl mb-10 leading-relaxed">
          Hey! I'm <strong class="text-white font-semibold">SASHA</strong>. Your friendly companion for Python Full Stack development, IT English communication, and personal projects.
        </p>

        <!-- 4 Prompt Suggestion Cards (2x2 Grid) -->
        <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl w-full text-left">
          <button class="hero-card group p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 text-left transition-all" data-prompt="Help me learn Python from scratch. Can you explain variables and loops step by step?">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                <i data-lucide="code" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Help me learn Python
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-snug">
                  Master variables, loops, functions, and OOP with beginner exercises.
                </p>
              </div>
            </div>
          </button>

          <button class="hero-card group p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 text-left transition-all" data-prompt="Teach me professional English for IT interviews. How do I introduce myself using the STAR method?">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <i data-lucide="sparkles" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                  Teach me English
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-snug">
                  Practice IT interview communication, self-introduction, and standups.
                </p>
              </div>
            </div>
          </button>

          <button class="hero-card group p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 text-left transition-all" data-prompt="Explain how Large Language Models (LLMs) and neural networks work in simple terms.">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <i data-lucide="cpu" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  Explain an AI concept
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-snug">
                  Understand tokens, neural networks, and prompt engineering simply.
                </p>
              </div>
            </div>
          </button>

          <button class="hero-card group p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 text-left transition-all" data-prompt="Help me build a website with HTML, CSS, JavaScript, and a Python backend. Where should I start?">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <i data-lucide="layout" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Help me build a website
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-snug">
                  Connect modern frontend design with FastAPI and SQLite databases.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    `;
  },

  attachHeroPromptEvents() {
    document.querySelectorAll(".hero-card").forEach(card => {
      card.addEventListener("click", () => {
        const prompt = card.getAttribute("data-prompt");
        this.prefillAndSend(prompt);
      });
    });
  },

  renderMessageBubble(msg) {
    const isUser = msg.sender === "user";
    const timeFormatted = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const attachments = Array.isArray(msg.attachments) ? msg.attachments : [];

    if (isUser) {
      return `
        <div class="flex justify-end items-end gap-3 group">
          <div class="max-w-[85%] md:max-w-[70%] space-y-1.5">
            ${attachments.length > 0 ? `
              <div class="flex flex-wrap justify-end gap-1.5 mb-1">
                ${attachments.map(att => `
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/80 border border-slate-700 text-slate-300">
                    <i data-lucide="file-code" class="w-3 h-3 text-cyan-400"></i> ${this.escapeHtml(att.name)}
                  </span>
                `).join("")}
              </div>
            ` : ''}

            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-md text-sm leading-relaxed whitespace-pre-wrap">
              ${this.escapeHtml(msg.content)}
            </div>
            <div class="text-[10px] text-slate-500 text-right font-mono pr-1">
              ${timeFormatted}
            </div>
          </div>

          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 text-xs font-bold">
            U
          </div>
        </div>
      `;
    }

    // AI Message
    const parsedHtml = this.parseMarkdown(msg.content);
    return `
      <div class="flex justify-start items-start gap-3 group">
        <!-- SASHA Avatar -->
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shrink-0 shadow-lg shadow-purple-600/30">
          <div class="w-full h-full bg-[#0c1017] rounded-[10px] flex items-center justify-center">
            <i data-lucide="sparkles" class="w-4 h-4 text-cyan-400"></i>
          </div>
        </div>

        <div class="max-w-[92%] md:max-w-[80%] space-y-2">
          <!-- Model badge & timestamp -->
          <div class="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span class="text-purple-400 font-semibold font-sans">SASHA AI</span>
            <span>•</span>
            <span class="text-slate-400 text-[10px]">${this.escapeHtml(msg.model || 'SASHA Engine')}</span>
            <span>•</span>
            <span>${timeFormatted}</span>
          </div>

          <!-- Message Card -->
          <div class="glass-panel border border-slate-800/80 rounded-2xl rounded-tl-sm p-4 md:p-5 shadow-sm text-sm text-slate-200 prose-sasha">
            ${parsedHtml}
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-1.5 pt-1 text-slate-500">
            <button class="copy-msg-btn px-2.5 py-1 rounded-lg hover:bg-slate-800 hover:text-slate-200 text-xs flex items-center gap-1 transition-all" data-content="${encodeURIComponent(msg.content)}">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
            <button class="read-msg-btn px-2.5 py-1 rounded-lg hover:bg-slate-800 hover:text-slate-200 text-xs flex items-center gap-1 transition-all" data-content="${encodeURIComponent(msg.content)}">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Read Aloud
            </button>
            <button class="retry-msg-btn px-2.5 py-1 rounded-lg hover:bg-slate-800 hover:text-slate-200 text-xs flex items-center gap-1 transition-all" title="Regenerate response">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Retry
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderThinkingIndicator() {
    return `
      <div class="flex justify-start items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shrink-0 animate-pulse">
          <div class="w-full h-full bg-[#0c1017] rounded-[10px] flex items-center justify-center">
            <i data-lucide="sparkles" class="w-4 h-4 text-cyan-400"></i>
          </div>
        </div>
        <div class="glass-panel px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-800 flex items-center gap-2">
          <span class="text-xs text-slate-400 font-medium">SASHA is thinking</span>
          <div class="flex items-center gap-1">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;
  },

  attachMessageActions() {
    // Copy response
    document.querySelectorAll(".copy-msg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const raw = decodeURIComponent(btn.getAttribute("data-content"));
        navigator.clipboard.writeText(raw).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> Copied!`;
          if (window.lucide) window.lucide.createIcons();
          setTimeout(() => {
            btn.innerHTML = original;
            if (window.lucide) window.lucide.createIcons();
          }, 2000);
        });
      });
    });

    // Read Aloud
    document.querySelectorAll(".read-msg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const raw = decodeURIComponent(btn.getAttribute("data-content"));
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(raw.replace(/[#*`]/g, ''));
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        } else {
          alert("Text-to-speech is not supported in this browser.");
        }
      });
    });

    // Retry response
    document.querySelectorAll(".retry-msg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lastUserMsg = [...this.messages].reverse().find(m => m.sender === "user");
        if (lastUserMsg) {
          this.sendMessage(lastUserMsg.content);
        }
      });
    });

    // Copy code button in code blocks
    document.querySelectorAll(".copy-code-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const code = decodeURIComponent(btn.getAttribute("data-code"));
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "Copied! ✓";
          setTimeout(() => btn.textContent = "Copy", 2000);
        });
      });
    });
  },

  async prefillAndSend(prompt) {
    const input = document.getElementById("chatInput");
    if (input) {
      input.value = prompt;
      this.autoResizeTextarea(input);
    }
    await this.sendMessage(prompt);
  },

  async sendMessage(customText = null) {
    if (this.isGenerating) return;

    const input = document.getElementById("chatInput");
    const text = customText || (input ? input.value.trim() : "");
    if (!text && this.attachedFiles.length === 0) return;

    if (input) {
      input.value = "";
      this.autoResizeTextarea(input);
    }

    const attachmentsToSend = [...this.attachedFiles];
    this.attachedFiles = [];
    this.renderAttachmentBadges();

    // Prepare temp user message for instant UI responsiveness
    const tempUserMsg = {
      id: "temp-" + Date.now(),
      sender: "user",
      content: text,
      created_at: new Date().toISOString(),
      attachments: attachmentsToSend
    };

    this.messages.push(tempUserMsg);
    this.isGenerating = true;
    this.renderChatMessages();
    this.updateSendButtonState();

    try {
      const config = window.SettingsHub ? window.SettingsHub.getConfig() : {};
      const model = config.model || "sasha_demo";
      const apiKey = config.apiKey || "";

      // Send to API
      const response = await window.API.sendChatMessage(
        this.activeConversationId,
        text,
        model,
        apiKey,
        attachmentsToSend
      );

      if (response) {
        this.activeConversationId = response.conversation_id;
        // Replace temp message with server saved message
        this.messages.pop();
        this.messages.push(response.user_message);
        this.messages.push(response.ai_message);

        if (response.is_new) {
          await this.loadConversations();
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      this.messages.push({
        id: "err-" + Date.now(),
        sender: "sasha",
        content: `⚠️ Sorry, an error occurred while processing your request: ${err.message}`,
        model: "SASHA Error Guard",
        created_at: new Date().toISOString()
      });
    } finally {
      this.isGenerating = false;
      this.renderChatMessages();
      this.updateSendButtonState();
    }
  },

  parseMarkdown(text) {
    if (!text) return "";
    if (window.marked) {
      // Configure marked with custom code block renderer
      const renderer = new marked.Renderer();
      renderer.code = (code, language) => {
        const lang = language || 'text';
        const encoded = encodeURIComponent(code);
        return `
          <div class="code-container">
            <div class="code-header">
              <span>${lang}</span>
              <button class="copy-code-btn px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" data-code="${encoded}">
                Copy
              </button>
            </div>
            <pre><code>${this.escapeHtml(code)}</code></pre>
          </div>
        `;
      };
      return marked.parse(text, { renderer });
    }

    // Fallback basic parser
    return this.escapeHtml(text).replace(/\n/g, '<br/>');
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  handleFileUpload(files) {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.attachedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          content: e.target.result
        });
        this.renderAttachmentBadges();
        this.updateSendButtonState();
      };
      reader.readAsText(file);
    }
  },

  renderAttachmentBadges() {
    const container = document.getElementById("attachmentChips");
    if (!container) return;

    if (this.attachedFiles.length === 0) {
      container.innerHTML = "";
      container.classList.add("hidden");
      return;
    }

    container.classList.remove("hidden");
    container.innerHTML = this.attachedFiles.map((file, idx) => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
        <i data-lucide="file-code" class="w-3.5 h-3.5"></i> ${this.escapeHtml(file.name)}
        <button class="remove-att-btn text-cyan-400 hover:text-white" data-index="${idx}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </span>
    `).join("");

    if (window.lucide) window.lucide.createIcons();

    container.querySelectorAll(".remove-att-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        this.attachedFiles.splice(idx, 1);
        this.renderAttachmentBadges();
        this.updateSendButtonState();
      });
    });
  },

  updateModelBadge() {
    const badge = document.getElementById("activeModelBadge");
    const dropdown = document.getElementById("modelSelectDropdown");
    if (!badge && !dropdown) return;

    const config = window.SettingsHub ? window.SettingsHub.getConfig() : {};
    const model = config.model || "sasha_demo";

    const labelMap = {
      "sasha_demo": "✨ SASHA Smart Engine",
      "gemini-1.5-flash": "⚡ Gemini 1.5 Flash",
      "gemini-1.5-pro": "🧠 Gemini 1.5 Pro"
    };

    const label = labelMap[model] || "SASHA AI";
    if (badge) badge.textContent = label;
    if (dropdown) dropdown.value = model;
  },

  updateSendButtonState() {
    const input = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendMsgBtn");
    if (!sendBtn) return;

    const hasText = input && input.value.trim().length > 0;
    const hasFiles = this.attachedFiles.length > 0;
    const canSend = (hasText || hasFiles) && !this.isGenerating;

    sendBtn.disabled = !canSend;
    if (canSend) {
      sendBtn.classList.remove("opacity-40", "cursor-not-allowed");
      sendBtn.classList.add("cursor-pointer", "hover:scale-105");
    } else {
      sendBtn.classList.add("opacity-40", "cursor-not-allowed");
      sendBtn.classList.remove("cursor-pointer", "hover:scale-105");
    }
  },

  autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  },

  scrollToBottom() {
    const scrollContainer = document.getElementById("chatScrollArea");
    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 50);
    }
  }
};

window.Chat = Chat;
