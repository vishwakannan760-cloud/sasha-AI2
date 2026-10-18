/**
 * SASHA AI — Master Application Coordinator
 * -----------------------------------------
 * Manages view routing, sidebar responsiveness, global keyboard shortcuts,
 * and user profile display.
 */

const App = {
  currentView: "chat", // 'chat', 'learning', 'projects', 'settings'

  async init() {
    this.updateUserProfileDisplay();
    this.attachGlobalEvents();

    // Check backend health
    const health = await window.API.getHealth();
    console.log("SASHA AI Server Status:", health);

    // Initialize Chat
    if (window.Chat) {
      await window.Chat.init();
    }

    this.switchView("chat");
  },

  updateUserProfileDisplay() {
    const config = window.SettingsHub ? window.SettingsHub.getConfig() : {};
    const nameEl = document.getElementById("profileUserName");
    const roleEl = document.getElementById("profileUserRole");

    if (nameEl) nameEl.textContent = config.userName || "Developer Learner";
    if (roleEl) roleEl.textContent = config.userRole || "Python Full Stack";
  },

  switchView(viewName) {
    this.currentView = viewName;

    // Update navigation active states
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
      const v = item.getAttribute("data-view");
      if (v === viewName) {
        item.classList.add("bg-purple-600/20", "text-cyan-300", "border", "border-purple-500/30");
        item.classList.remove("text-slate-400", "hover:text-slate-200");
      } else {
        item.classList.remove("bg-purple-600/20", "text-cyan-300", "border", "border-purple-500/30");
        item.classList.add("text-slate-400", "hover:text-slate-200");
      }
    });

    const chatView = document.getElementById("chatViewWrapper");
    const dynamicView = document.getElementById("dynamicViewWrapper");
    const container = document.getElementById("mainViewContainer");

    if (viewName === "chat") {
      if (chatView) chatView.classList.remove("hidden");
      if (dynamicView) dynamicView.classList.add("hidden");
      if (window.Chat) window.Chat.renderChatMessages();
    } else {
      if (chatView) chatView.classList.add("hidden");
      if (dynamicView) dynamicView.classList.remove("hidden");

      if (viewName === "learning" && window.LearningHub) {
        window.LearningHub.render("mainViewContainer");
      } else if (viewName === "projects" && window.ProjectsHub) {
        window.ProjectsHub.render("mainViewContainer");
      } else if (viewName === "settings" && window.SettingsHub) {
        window.SettingsHub.render("mainViewContainer");
      }
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById("sidebar");
    if (sidebar && window.innerWidth < 768) {
      sidebar.classList.add("-translate-x-full");
      const overlay = document.getElementById("mobileBackdrop");
      if (overlay) overlay.classList.add("hidden");
    }
  },

  attachGlobalEvents() {
    // Navigation view clicks
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
      item.addEventListener("click", () => {
        const view = item.getAttribute("data-view");
        this.switchView(view);
      });
    });

    // New Chat button
    const newChatBtn = document.getElementById("newChatBtn");
    if (newChatBtn) {
      newChatBtn.addEventListener("click", () => {
        this.switchView("chat");
        if (window.Chat) window.Chat.startNewChat();
      });
    }

    // Top navbar "Direct Chat" button
    const topDirectChatBtn = document.getElementById("topDirectChatBtn");
    if (topDirectChatBtn) {
      topDirectChatBtn.addEventListener("click", () => {
        this.switchView("chat");
      });
    }

    // Mobile sidebar toggle button
    const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileBackdrop");

    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener("click", () => {
        const isHidden = sidebar.classList.contains("-translate-x-full");
        if (isHidden) {
          sidebar.classList.remove("-translate-x-full");
          if (overlay) overlay.classList.remove("hidden");
        } else {
          sidebar.classList.add("-translate-x-full");
          if (overlay) overlay.classList.add("hidden");
        }
      });
    }

    if (overlay && sidebar) {
      overlay.addEventListener("click", () => {
        sidebar.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
      });
    }

    // Desktop sidebar collapse toggle
    const desktopCollapseBtn = document.getElementById("desktopCollapseBtn");
    if (desktopCollapseBtn && sidebar) {
      desktopCollapseBtn.addEventListener("click", () => {
        sidebar.classList.toggle("md:w-64");
        sidebar.classList.toggle("md:w-0");
        sidebar.classList.toggle("md:overflow-hidden");
      });
    }

    // Search input
    const searchInput = document.getElementById("searchChatsInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        if (window.Chat) {
          window.Chat.renderSidebarHistory(e.target.value);
        }
      });
    }

    // Bottom Settings button
    const settingsBtn = document.getElementById("bottomSettingsBtn");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        this.switchView("settings");
      });
    }

    // Global Key shortcuts
    window.addEventListener("keydown", (e) => {
      // Ctrl+K or Cmd+K -> New Chat
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.switchView("chat");
        if (window.Chat) window.Chat.startNewChat();
      }
    });

    // Chat input textarea interactions
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendMsgBtn");

    if (chatInput) {
      chatInput.addEventListener("input", () => {
        if (window.Chat) {
          window.Chat.autoResizeTextarea(chatInput);
          window.Chat.updateSendButtonState();
        }
      });

      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (window.Chat) window.Chat.sendMessage();
        }
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        if (window.Chat) window.Chat.sendMessage();
      });
    }

    // Mic button
    const micBtn = document.getElementById("micBtn");
    if (micBtn) {
      micBtn.addEventListener("click", () => {
        if (window.Chat) window.Chat.toggleSpeech();
      });
    }

    // File input button
    const attachBtn = document.getElementById("attachFileBtn");
    const fileInput = document.getElementById("fileAttachmentInput");
    if (attachBtn && fileInput) {
      attachBtn.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", (e) => {
        if (window.Chat && e.target.files.length > 0) {
          window.Chat.handleFileUpload(e.target.files);
        }
      });
    }

    // Model dropdown inside chat capsule
    const modelDropdown = document.getElementById("modelSelectDropdown");
    if (modelDropdown) {
      modelDropdown.addEventListener("change", (e) => {
        if (window.SettingsHub) {
          window.SettingsHub.saveConfig({ model: e.target.value });
        }
        if (window.Chat) {
          window.Chat.updateModelBadge();
        }
      });
    }
  }
};

window.App = App;

// Start on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
