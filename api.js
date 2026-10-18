/**
 * SASHA AI — API Client
 * ---------------------
 * Communicates with the FastAPI backend.
 * Provides fallback to local storage if running in standalone mode.
 */

const API = {
  baseUrl: window.location.origin.includes('http') ? window.location.origin : 'http://127.0.0.1:8000',

  async getHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`);
      return await res.json();
    } catch (e) {
      console.warn("Backend not detected, falling back to client-only mode:", e);
      return { status: "client_mode", service: "SASHA AI Client Engine" };
    }
  },

  // --- Conversations ---
  async getConversations() {
    try {
      const res = await fetch(`${this.baseUrl}/api/conversations`);
      if (res.ok) {
        const data = await res.json();
        return data.conversations;
      }
    } catch (e) {
      console.warn("Using localStorage for conversations:", e);
    }
    const local = localStorage.getItem("sasha_conversations");
    return local ? JSON.parse(local) : [];
  },

  async createConversation(title = "New Conversation") {
    try {
      const res = await fetch(`${this.baseUrl}/api/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        const data = await res.json();
        return data.conversation;
      }
    } catch (e) {
      console.warn("Creating conversation locally:", e);
    }
    const id = "conv-" + Date.now();
    const conv = { id, title, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const list = await this.getConversations();
    list.unshift(conv);
    localStorage.setItem("sasha_conversations", JSON.stringify(list));
    return conv;
  },

  async getMessages(convId) {
    try {
      const res = await fetch(`${this.baseUrl}/api/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        return data.messages;
      }
    } catch (e) {
      console.warn("Loading messages locally:", e);
    }
    const local = localStorage.getItem(`sasha_msgs_${convId}`);
    return local ? JSON.parse(local) : [];
  },

  async renameConversation(convId, title) {
    try {
      const res = await fetch(`${this.baseUrl}/api/conversations/${convId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Renaming locally:", e);
    }
    const list = await this.getConversations();
    const c = list.find(x => x.id === convId);
    if (c) {
      c.title = title;
      c.updated_at = new Date().toISOString();
      localStorage.setItem("sasha_conversations", JSON.stringify(list));
      return true;
    }
    return false;
  },

  async deleteConversation(convId) {
    try {
      const res = await fetch(`${this.baseUrl}/api/conversations/${convId}`, {
        method: "DELETE"
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Deleting locally:", e);
    }
    let list = await this.getConversations();
    list = list.filter(x => x.id !== convId);
    localStorage.setItem("sasha_conversations", JSON.stringify(list));
    localStorage.removeItem(`sasha_msgs_${convId}`);
    return true;
  },

  // --- Chat ---
  async sendChatMessage(convId, message, model, apiKey, attachments = []) {
    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: convId,
          message,
          model,
          api_key: apiKey,
          attachments
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend chat failed, using in-browser SASHA engine:", e);
    }

    // Client-side fallback engine
    const now = new Date().toISOString();
    const userMsg = {
      id: "msg-" + Date.now(),
      conversation_id: convId,
      sender: "user",
      content: message,
      created_at: now,
      attachments
    };

    let reply = `Hello! I'm SASHA AI. I received your message: "${message}". As an AI assistant, I can explain Python code, help you practice IT English, and guide your projects!`;
    const aiMsg = {
      id: "msg-" + (Date.now() + 1),
      conversation_id: convId,
      sender: "sasha",
      content: reply,
      model: "SASHA Client Engine",
      created_at: now
    };

    return {
      conversation_id: convId,
      user_message: userMsg,
      ai_message: aiMsg,
      model_used: "SASHA Client Engine",
      is_demo: true
    };
  },

  // --- Projects ---
  async getProjects() {
    try {
      const res = await fetch(`${this.baseUrl}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        return data.projects;
      }
    } catch (e) {
      console.warn("Getting projects locally:", e);
    }
    const local = localStorage.getItem("sasha_projects");
    return local ? JSON.parse(local) : [];
  },

  async createProject(project) {
    try {
      const res = await fetch(`${this.baseUrl}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const data = await res.json();
        return data.project;
      }
    } catch (e) {
      console.warn("Creating project locally:", e);
    }
    project.id = "proj-" + Date.now();
    project.updated_at = new Date().toISOString();
    const list = await this.getProjects();
    list.unshift(project);
    localStorage.setItem("sasha_projects", JSON.stringify(list));
    return project;
  },

  async updateProject(id, project) {
    try {
      const res = await fetch(`${this.baseUrl}/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Updating project locally:", e);
    }
    const list = await this.getProjects();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...project, updated_at: new Date().toISOString() };
      localStorage.setItem("sasha_projects", JSON.stringify(list));
      return true;
    }
    return false;
  },

  async deleteProject(id) {
    try {
      const res = await fetch(`${this.baseUrl}/api/projects/${id}`, {
        method: "DELETE"
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Deleting project locally:", e);
    }
    let list = await this.getProjects();
    list = list.filter(p => p.id !== id);
    localStorage.setItem("sasha_projects", JSON.stringify(list));
    return true;
  },

  // --- Safe Python Code Execution ---
  async runCode(code) {
    try {
      const res = await fetch(`${this.baseUrl}/api/run-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Run code backend error:", e);
    }
    return {
      success: false,
      stdout: "",
      stderr: "Backend server not reached. Ensure python backend is running to execute live Python code.",
      exit_code: 1
    };
  },

  // --- Memory ---
  async getMemory() {
    try {
      const res = await fetch(`${this.baseUrl}/api/memory`);
      if (res.ok) {
        const data = await res.json();
        return data.memory_items;
      }
    } catch (e) {
      console.warn("Getting memory locally:", e);
    }
    const local = localStorage.getItem("sasha_memory");
    return local ? JSON.parse(local) : [];
  },

  async addMemory(key, value, category = "general") {
    try {
      const res = await fetch(`${this.baseUrl}/api/memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, category })
      });
      if (res.ok) {
        const data = await res.json();
        return data.memory_item;
      }
    } catch (e) {
      console.warn("Adding memory locally:", e);
    }
    const item = { id: "mem-" + Date.now(), key, value, category, updated_at: new Date().toISOString() };
    const list = await this.getMemory();
    list.unshift(item);
    localStorage.setItem("sasha_memory", JSON.stringify(list));
    return item;
  },

  async deleteMemory(id) {
    try {
      const res = await fetch(`${this.baseUrl}/api/memory/${id}`, {
        method: "DELETE"
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Deleting memory locally:", e);
    }
    let list = await this.getMemory();
    list = list.filter(m => m.id !== id);
    localStorage.setItem("sasha_memory", JSON.stringify(list));
    return true;
  }
};

window.API = API;
