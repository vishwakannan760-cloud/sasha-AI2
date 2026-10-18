/**
 * SASHA AI — "My Projects" Workspace
 * -----------------------------------
 * Manages developer projects with full CRUD, status badges, tech stack tags,
 * and direct "Consult SASHA" AI brainstorming links.
 */

const ProjectsHub = {
  projects: [],
  filterStatus: "all",

  async loadProjects() {
    this.projects = await window.API.getProjects();
  },

  async render(containerId) {
    await this.loadProjects();
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = this.projects.filter(p => {
      if (this.filterStatus === "all") return true;
      return p.status.toLowerCase() === this.filterStatus.toLowerCase();
    });

    const counts = {
      all: this.projects.length,
      inProgress: this.projects.filter(p => p.status === "In Progress").length,
      planning: this.projects.filter(p => p.status === "Planning").length,
      completed: this.projects.filter(p => p.status === "Completed").length
    };

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Workspace
              </span>
              <span class="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Developer Projects
              </span>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
              My Projects
            </h1>
            <p class="text-slate-400 text-sm mt-1">
              Build, track, and architect your Python Full Stack and AI portfolio.
            </p>
          </div>

          <!-- Add Project Button -->
          <button id="addProjectBtn" class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-200 active:scale-95">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Add New Project
          </button>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
          <button class="project-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${this.filterStatus === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}" data-filter="all">
            All (${counts.all})
          </button>
          <button class="project-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${this.filterStatus === 'in progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}" data-filter="in progress">
            In Progress (${counts.inProgress})
          </button>
          <button class="project-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${this.filterStatus === 'planning' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}" data-filter="planning">
            Planning (${counts.planning})
          </button>
          <button class="project-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${this.filterStatus === 'completed' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}" data-filter="completed">
            Completed (${counts.completed})
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${filtered.length === 0 ? `
            <div class="col-span-full py-16 text-center text-slate-500">
              <i data-lucide="folder-kanban" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
              <p class="text-base font-medium">No projects found in this category.</p>
              <p class="text-xs text-slate-600 mt-1">Click "Add New Project" above to create one!</p>
            </div>
          ` : filtered.map(p => this.renderProjectCard(p)).join("")}
        </div>
      </div>

      <!-- Add/Edit Project Modal -->
      <div id="projectModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 id="modalTitle" class="text-base font-semibold text-white">Add New Project</h3>
            <button id="closeModalBtn" class="text-slate-400 hover:text-white">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="projectForm" class="space-y-4">
            <input type="hidden" id="projId" value="" />
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Project Name *</label>
              <input type="text" id="projName" required class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400" placeholder="e.g. Personal Portfolio Website" />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Description *</label>
              <textarea id="projDesc" rows="3" required class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400" placeholder="What does this project do and what are you building?"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Status</label>
                <select id="projStatus" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400">
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input type="text" id="projTags" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400" placeholder="Python, FastAPI, React" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">GitHub / Live URL (Optional)</label>
              <input type="url" id="projUrl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400" placeholder="https://github.com/your-username/project" />
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" id="cancelModalBtn" class="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white">Cancel</button>
              <button type="submit" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25">Save Project</button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.attachEvents();
  },

  renderProjectCard(p) {
    const statusColors = {
      "In Progress": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      "Planning": "bg-amber-500/10 text-amber-400 border-amber-500/30",
      "Completed": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    };

    const badgeClass = statusColors[p.status] || "bg-slate-500/10 text-slate-400 border-slate-500/30";
    const tags = Array.isArray(p.tags) ? p.tags : [];
    const dateFormatted = p.updated_at ? new Date(p.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

    return `
      <div class="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between group">
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              ${p.name}
            </h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass} shrink-0">
              ${p.status}
            </span>
          </div>

          <p class="text-slate-300 text-sm leading-relaxed mb-4">
            ${p.description}
          </p>

          <div class="flex flex-wrap gap-1.5 mb-5">
            ${tags.map(t => `
              <span class="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                ${t}
              </span>
            `).join("")}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span class="text-slate-500 font-mono text-[11px]">
            Updated: ${dateFormatted}
          </span>

          <div class="flex items-center gap-2">
            <button class="consult-sasha-btn px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 font-medium flex items-center gap-1.5 transition-all" data-name="${p.name}">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Consult SASHA
            </button>
            <button class="edit-proj-btn text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all" data-id="${p.id}">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button class="del-proj-btn text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all" data-id="${p.id}">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Filter clicks
    document.querySelectorAll(".project-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.filterStatus = btn.getAttribute("data-filter");
        this.render("mainViewContainer");
      });
    });

    // Add project modal open
    const addBtn = document.getElementById("addProjectBtn");
    const modal = document.getElementById("projectModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelModalBtn");
    const form = document.getElementById("projectForm");

    if (addBtn && modal) {
      addBtn.addEventListener("click", () => {
        document.getElementById("modalTitle").textContent = "Add New Project";
        document.getElementById("projId").value = "";
        document.getElementById("projName").value = "";
        document.getElementById("projDesc").value = "";
        document.getElementById("projStatus").value = "Planning";
        document.getElementById("projTags").value = "";
        document.getElementById("projUrl").value = "";
        modal.classList.remove("hidden");
      });
    }

    const closeModal = () => modal && modal.classList.add("hidden");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    // Form submit
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("projId").value;
        const name = document.getElementById("projName").value.trim();
        const description = document.getElementById("projDesc").value.trim();
        const status = document.getElementById("projStatus").value;
        const tagsRaw = document.getElementById("projTags").value;
        const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];
        const github_url = document.getElementById("projUrl").value.trim();

        if (id) {
          await window.API.updateProject(id, { name, description, status, tags, github_url });
        } else {
          await window.API.createProject({ name, description, status, tags, github_url });
        }

        closeModal();
        await this.render("mainViewContainer");
      });
    }

    // Edit project
    document.querySelectorAll(".edit-proj-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const p = this.projects.find(x => x.id === id);
        if (p) {
          document.getElementById("modalTitle").textContent = "Edit Project";
          document.getElementById("projId").value = p.id;
          document.getElementById("projName").value = p.name;
          document.getElementById("projDesc").value = p.description;
          document.getElementById("projStatus").value = p.status;
          document.getElementById("projTags").value = Array.isArray(p.tags) ? p.tags.join(", ") : "";
          document.getElementById("projUrl").value = p.github_url || "";
          modal.classList.remove("hidden");
        }
      });
    });

    // Delete project
    document.querySelectorAll(".del-proj-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this project?")) {
          await window.API.deleteProject(id);
          await this.render("mainViewContainer");
        }
      });
    });

    // Consult SASHA
    document.querySelectorAll(".consult-sasha-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        if (window.App) {
          window.App.switchView("chat");
          const prompt = `Hey SASHA, let's work on my project: "${name}". What are the best next steps, architecture choices, or features I should implement?`;
          window.Chat.prefillAndSend(prompt);
        }
      });
    });
  }
};

window.ProjectsHub = ProjectsHub;
