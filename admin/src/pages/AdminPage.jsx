import { useEffect, useState } from "react";
import { API } from "../api/axios";

const emptyProject = {
  title: "",
  description: "",
  githubLink: "",
  githubLink2: "",
  liveLink: "",
  techStack: "",
  priority: "",
};

const emptySkill = {
  category: "",
  itemsText: "",
  priority: "",
};

const emptyCredential = {
  title: "",
  type: "certificate",
  institution: "",
  score: "",
  year: "",
  description: "",
  fileUrl: "",
  priority: "",
};

const PRIORITY_OPTIONS = Array.from({ length: 20 }, (_, index) => String(index + 1));

const parseSkillsInput = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|");
      return {
        name: (parts[0] || "").trim(),
        icon: (parts[1] || "").trim(),
      };
    })
    .filter((item) => item.name);

const skillsToText = (skills = []) => skills.map((item) => `${item.name}|${item.icon || ""}`).join("\n");

export default function Admin() {
  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || "http://localhost:5173";

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projectImage, setProjectImage] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState("");

  const [skillForm, setSkillForm] = useState(emptySkill);
  const [editingSkillId, setEditingSkillId] = useState("");

  const [credentialForm, setCredentialForm] = useState(emptyCredential);
  const [editingCredentialId, setEditingCredentialId] = useState("");
  const [dragState, setDragState] = useState({ listType: "", itemId: "" });

  const [status, setStatus] = useState({ type: "", message: "" });

  const loadAllData = async () => {
    try {
      setLoadingData(true);
      const [projectRes, skillRes, credentialRes] = await Promise.all([
        API.get("/projects"),
        API.get("/skills"),
        API.get("/credentials"),
      ]);

      setProjects(projectRes.data);
      setSkills(skillRes.data);
      setCredentials(credentialRes.data);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Unable to load admin data.",
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const resetProjectForm = () => {
    setProjectForm(emptyProject);
    setProjectImage(null);
    setEditingProjectId("");
  };

  const resetSkillForm = () => {
    setSkillForm(emptySkill);
    setEditingSkillId("");
  };

  const resetCredentialForm = () => {
    setCredentialForm(emptyCredential);
    setEditingCredentialId("");
  };

  const submitProject = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();
      payload.append("title", projectForm.title);
      payload.append("description", projectForm.description);
      payload.append("githubLink", projectForm.githubLink);
      payload.append("githubLink2", projectForm.githubLink2);
      payload.append("liveLink", projectForm.liveLink);
      payload.append("techStack", projectForm.techStack);
      if (projectForm.priority) payload.append("priority", projectForm.priority);
      if (projectImage) payload.append("image", projectImage);

      if (editingProjectId) {
        await API.put(`/projects/${editingProjectId}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setStatus({ type: "success", message: "Project updated." });
      } else {
        await API.post("/projects", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setStatus({ type: "success", message: "Project added." });
      }

      resetProjectForm();
      await loadAllData();
    } catch (err) {
      const responseData = err.response?.data;
      const backendMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.error || responseData?.msg;

      setStatus({
        type: "error",
        message: backendMessage || err.message || "Project save failed.",
      });
    }
  };

  const editProject = (project) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      githubLink: project.githubLink || "",
      githubLink2: project.githubLink2 || "",
      liveLink: project.liveLink || "",
      techStack: (project.techStack || []).join(", "),
      priority: project.priority ? String(project.priority) : "",
    });
    setProjectImage(null);
  };

  const removeProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      setStatus({ type: "success", message: "Project deleted." });
      await loadAllData();
      if (editingProjectId === id) resetProjectForm();
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.msg || "Delete failed." });
    }
  };

  const submitSkill = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        category: skillForm.category,
        skills: parseSkillsInput(skillForm.itemsText),
        priority: skillForm.priority ? Number(skillForm.priority) : null,
      };

      if (editingSkillId) {
        await API.put(`/skills/${editingSkillId}`, payload);
        setStatus({ type: "success", message: "Skill category updated." });
      } else {
        await API.post("/skills", payload);
        setStatus({ type: "success", message: "Skill category added." });
      }

      resetSkillForm();
      await loadAllData();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || err.response?.data?.msg || "Skill save failed.",
      });
    }
  };

  const editSkill = (item) => {
    setEditingSkillId(item._id);
    setSkillForm({
      category: item.category || "",
      itemsText: skillsToText(item.skills || []),
      priority: item.priority ? String(item.priority) : "",
    });
  };

  const removeSkill = async (id) => {
    try {
      await API.delete(`/skills/${id}`);
      setStatus({ type: "success", message: "Skill category deleted." });
      await loadAllData();
      if (editingSkillId === id) resetSkillForm();
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.msg || "Delete failed." });
    }
  };

  const submitCredential = async (event) => {
    event.preventDefault();

    try {
      if (editingCredentialId) {
        await API.put(`/credentials/${editingCredentialId}`, credentialForm);
        setStatus({ type: "success", message: "Credential updated." });
      } else {
        await API.post("/credentials", credentialForm);
        setStatus({ type: "success", message: "Credential added." });
      }

      resetCredentialForm();
      await loadAllData();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || err.response?.data?.msg || "Credential save failed.",
      });
    }
  };

  const editCredential = (item) => {
    setEditingCredentialId(item._id);
    setCredentialForm({
      title: item.title || "",
      type: item.type || "certificate",
      institution: item.institution || "",
      score: item.score || "",
      year: item.year || "",
      description: item.description || "",
      fileUrl: item.fileUrl || "",
      priority: item.priority ? String(item.priority) : "",
    });
  };

  const removeCredential = async (id) => {
    try {
      await API.delete(`/credentials/${id}`);
      setStatus({ type: "success", message: "Credential deleted." });
      await loadAllData();
      if (editingCredentialId === id) resetCredentialForm();
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.msg || "Delete failed." });
    }
  };

  const reorderByIds = (items, draggedId, targetId) => {
    const fromIndex = items.findIndex((item) => item._id === draggedId);
    const toIndex = items.findIndex((item) => item._id === targetId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return items;
    }

    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    return updated;
  };

  const persistReorder = async (listType, orderedItems) => {
    const configByType = {
      projects: {
        endpoint: "/projects/reorder",
        setter: setProjects,
      },
      skills: {
        endpoint: "/skills/reorder",
        setter: setSkills,
      },
      credentials: {
        endpoint: "/credentials/reorder",
        setter: setCredentials,
      },
    };

    const config = configByType[listType];
    if (!config) return;

    try {
      const res = await API.put(config.endpoint, {
        orderedIds: orderedItems.map((item) => item._id),
      });
      config.setter(res.data);
      setStatus({ type: "success", message: `${listType} reordered.` });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Reorder failed.",
      });
      await loadAllData();
    }
  };

  const handleDragStart = (listType, itemId) => {
    setDragState({ listType, itemId });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (listType, targetId) => {
    if (dragState.listType !== listType || !dragState.itemId || dragState.itemId === targetId) {
      setDragState({ listType: "", itemId: "" });
      return;
    }

    const sourceList =
      listType === "projects" ? projects : listType === "skills" ? skills : credentials;

    const reordered = reorderByIds(sourceList, dragState.itemId, targetId);

    if (reordered === sourceList) {
      setDragState({ listType: "", itemId: "" });
      return;
    }

    if (listType === "projects") setProjects(reordered);
    if (listType === "skills") setSkills(reordered);
    if (listType === "credentials") setCredentials(reordered);

    setDragState({ listType: "", itemId: "" });
    await persistReorder(listType, reordered);
  };

  return (
    <main className="app-bg min-h-screen px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-500">Manage projects, skills, certificates, and marksheets.</p>
          </div>

          <div className="flex items-center gap-3">
            <a href={portfolioUrl} className="btn-soft">
              View Portfolio
            </a>
            <button onClick={loadAllData} className="btn-primary" type="button">
              Refresh
            </button>
          </div>
        </div>

        {status.message ? (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${
              status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        {loadingData ? <p className="mb-6 text-sm text-slate-500">Loading admin data...</p> : null}

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitProject} className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Projects</h2>
            <p className="mt-1 text-sm text-slate-500">Create or update portfolio projects.</p>

            <div className="mt-5 space-y-4">
              <input
                className="field"
                placeholder="Title"
                value={projectForm.title}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
              <textarea
                className="field min-h-28"
                placeholder="Description"
                value={projectForm.description}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
                required
              />
              <input
                className="field"
                placeholder="LinkedIn link"
                value={projectForm.githubLink}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, githubLink: event.target.value }))}
              />
              <input
                className="field"
                placeholder="Explanation link (optional)"
                value={projectForm.githubLink2}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, githubLink2: event.target.value }))}
              />
              <input
                className="field"
                placeholder="Live link"
                value={projectForm.liveLink}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, liveLink: event.target.value }))}
              />
              <input
                className="field"
                placeholder="Tech stack (comma separated)"
                value={projectForm.techStack}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, techStack: event.target.value }))}
              />
              <select
                className="field"
                value={projectForm.priority}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, priority: event.target.value }))}
              >
                <option value="">Select priority (optional)</option>
                {PRIORITY_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <input
                type="file"
                className="field py-3"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(event) => setProjectImage(event.target.files?.[0] || null)}
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button className="btn-primary" type="submit">
                {editingProjectId ? "Update Project" : "Add Project"}
              </button>
              {editingProjectId ? (
                <button className="btn-soft" type="button" onClick={resetProjectForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-950">Project List</h3>
            <p className="mt-1 text-xs text-slate-500">Drag and drop cards to auto-set priority.</p>
            <div className="mt-4 space-y-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  draggable
                  onDragStart={() => handleDragStart("projects", project._id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("projects", project._id)}
                  onDragEnd={() => setDragState({ listType: "", itemId: "" })}
                  className="cursor-move rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{project.title}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Priority: {project.priority || "Not set"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">{project.description}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-soft" type="button" onClick={() => editProject(project)}>
                      Edit
                    </button>
                    <button className="btn-primary" type="button" onClick={() => removeProject(project._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitSkill} className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Skills</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter one skill per line in this format: name|iconKey (example: React.js|SiReact).
            </p>

            <div className="mt-5 space-y-4">
              <input
                className="field"
                placeholder="Category"
                value={skillForm.category}
                onChange={(event) => setSkillForm((prev) => ({ ...prev, category: event.target.value }))}
                required
              />
              <select
                className="field"
                value={skillForm.priority}
                onChange={(event) => setSkillForm((prev) => ({ ...prev, priority: event.target.value }))}
              >
                <option value="">Select priority (optional)</option>
                {PRIORITY_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <textarea
                className="field min-h-40"
                placeholder="React.js|SiReact\nNode.js|SiNodedotjs"
                value={skillForm.itemsText}
                onChange={(event) => setSkillForm((prev) => ({ ...prev, itemsText: event.target.value }))}
                required
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button className="btn-primary" type="submit">
                {editingSkillId ? "Update Skill Category" : "Add Skill Category"}
              </button>
              {editingSkillId ? (
                <button className="btn-soft" type="button" onClick={resetSkillForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-950">Skill Categories</h3>
            <p className="mt-1 text-xs text-slate-500">Drag and drop cards to auto-set priority.</p>
            <div className="mt-4 space-y-3">
              {skills.map((item) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart("skills", item._id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("skills", item._id)}
                  onDragEnd={() => setDragState({ listType: "", itemId: "" })}
                  className="cursor-move rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{item.category}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Priority: {item.priority || "Not set"}</p>
                  <p className="mt-1 text-sm text-slate-500">{(item.skills || []).map((s) => s.name).join(", ")}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-soft" type="button" onClick={() => editSkill(item)}>
                      Edit
                    </button>
                    <button className="btn-primary" type="button" onClick={() => removeSkill(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitCredential} className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Certificates and Marksheets</h2>
            <p className="mt-1 text-sm text-slate-500">Manage education timeline, certificates, and marksheet entries.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                className="field sm:col-span-2"
                placeholder="Title"
                value={credentialForm.title}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />

              <select
                className="field"
                value={credentialForm.type}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="certificate">Certificate</option>
                <option value="marksheet">Marksheet</option>
                <option value="education">Education</option>
                <option value="achievement">Achievement</option>
              </select>

              <input
                className="field"
                placeholder="Year"
                value={credentialForm.year}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, year: event.target.value }))}
              />

              <select
                className="field"
                value={credentialForm.priority}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, priority: event.target.value }))}
              >
                <option value="">Select priority (optional)</option>
                {PRIORITY_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <input
                className="field"
                placeholder="Institution"
                value={credentialForm.institution}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, institution: event.target.value }))}
              />

              <input
                className="field"
                placeholder="Score/GPA/Percentage"
                value={credentialForm.score}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, score: event.target.value }))}
              />

              <input
                className="field sm:col-span-2"
                placeholder="Certificate URL / Marksheet URL"
                value={credentialForm.fileUrl}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, fileUrl: event.target.value }))}
              />

              <textarea
                className="field min-h-28 sm:col-span-2"
                placeholder="Description"
                value={credentialForm.description}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button className="btn-primary" type="submit">
                {editingCredentialId ? "Update Entry" : "Add Entry"}
              </button>
              {editingCredentialId ? (
                <button className="btn-soft" type="button" onClick={resetCredentialForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-950">Credential List</h3>
            <p className="mt-1 text-xs text-slate-500">Drag and drop cards to auto-set priority.</p>
            <div className="mt-4 space-y-3">
              {credentials.map((item) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart("credentials", item._id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("credentials", item._id)}
                  onDragEnd={() => setDragState({ listType: "", itemId: "" })}
                  className="cursor-move rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {[item.type, item.year, item.score].filter(Boolean).join(" • ")}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Priority: {item.priority || "Not set"}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-soft" type="button" onClick={() => editCredential(item)}>
                      Edit
                    </button>
                    <button className="btn-primary" type="button" onClick={() => removeCredential(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
