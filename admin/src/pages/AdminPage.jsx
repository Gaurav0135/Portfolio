import { useEffect, useState } from "react";
import { API } from "../api/axios";

const emptyProject = {
  title: "",
  description: "",
  linkedinLink: "",
  githubLink: "",
  liveLink: "",
  otherLink: "",
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
  credential: "",
  liveUrl: "",
  fileUrl: "",
};

const emptyEducationEntry = {
  title: "",
  institution: "",
  year: "",
  score: "",
  description: "",
  fileUrl: "",
};

const emptyResume = {
  title: "Resume",
  fileUrl: "",
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
  const [credentialFile, setCredentialFile] = useState(null);
  const [resumeForm, setResumeForm] = useState(emptyResume);
  const [resumeFile, setResumeFile] = useState(null);
  const [educationForm, setEducationForm] = useState(emptyEducationEntry);
  const [editingEducationId, setEditingEducationId] = useState("");
  const [educationImage, setEducationImage] = useState(null);
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
      const resumeRes = await API.get("/resume/current");

      setProjects(projectRes.data);
      setSkills(skillRes.data);
      setCredentials(credentialRes.data);
      setResumeForm({
        title: resumeRes.data?.title || "Resume",
        fileUrl: resumeRes.data?.fileUrl || "",
      });
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
    setCredentialFile(null);
  };

  const resetResumeForm = () => {
    setResumeForm(emptyResume);
    setResumeFile(null);
  };

  const resetEducationForm = () => {
    setEducationForm(emptyEducationEntry);
    setEditingEducationId("");
    setEducationImage(null);
  };

  const submitProject = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();
      payload.append("title", projectForm.title);
      payload.append("description", projectForm.description);
      payload.append("linkedinLink", projectForm.linkedinLink);
      payload.append("githubLink", projectForm.githubLink);
      payload.append("liveLink", projectForm.liveLink);
      payload.append("otherLink", projectForm.otherLink);
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
      linkedinLink: project.linkedinLink || "",
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      otherLink: project.otherLink || project.githubLink2 || "",
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
      const payload = new FormData();
      payload.append("title", credentialForm.title);
      payload.append("type", credentialForm.type);
      payload.append("institution", credentialForm.institution);
      payload.append("score", credentialForm.score);
      payload.append("year", credentialForm.year);
      payload.append("description", credentialForm.description);
      payload.append("credential", credentialForm.credential);
      payload.append("liveUrl", credentialForm.liveUrl);
      payload.append("fileUrl", credentialForm.fileUrl);
      if (credentialFile) payload.append("file", credentialFile);

      if (editingCredentialId) {
        await API.put(`/credentials/${editingCredentialId}`, payload);
        setStatus({ type: "success", message: "Credential updated." });
      } else {
        await API.post("/credentials", payload);
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
      credential: item.credential || "",
      liveUrl: item.liveUrl || "",
      fileUrl: item.fileUrl || "",
    });
    setCredentialFile(null);
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

  const submitEducation = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();
      payload.append("title", educationForm.title);
      payload.append("type", "education");
      payload.append("institution", educationForm.institution);
      payload.append("score", educationForm.score);
      payload.append("year", educationForm.year);
      payload.append("description", educationForm.description);
      payload.append("credential", "");
      payload.append("liveUrl", "");
      payload.append("fileUrl", educationForm.fileUrl || "");
      if (educationImage) payload.append("file", educationImage);

      if (editingEducationId) {
        await API.put(`/credentials/${editingEducationId}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setStatus({ type: "success", message: "Education entry updated." });
      } else {
        await API.post("/credentials", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setStatus({ type: "success", message: "Education entry added." });
      }

      resetEducationForm();
      await loadAllData();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || err.response?.data?.msg || "Education save failed.",
      });
    }
  };

  const submitResume = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();
      payload.append("title", resumeForm.title || "Resume");
      if (resumeFile) payload.append("file", resumeFile);

      await API.put("/resume/current", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({ type: "success", message: "Resume updated." });
      setResumeFile(null);
      await loadAllData();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || err.response?.data?.msg || "Resume save failed.",
      });
    }
  };

  const editEducation = (item) => {
    setEditingEducationId(item._id);
    setEducationForm({
      title: item.title || "",
      institution: item.institution || "",
      year: item.year || "",
      score: item.score || "",
      description: item.description || "",
      fileUrl: item.fileUrl || "",
    });
    setEducationImage(null);
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

  const certificateItems = credentials.filter((item) => item.type !== "education");
  const educationItems = credentials.filter((item) => item.type === "education");

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
          <form onSubmit={submitResume} className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Resume</h2>
            <p className="mt-1 text-sm text-slate-500">Upload the latest resume PDF used by the hero button.</p>

            <div className="mt-5 space-y-4">
              <input
                className="field"
                placeholder="Resume title"
                value={resumeForm.title}
                onChange={(event) => setResumeForm((prev) => ({ ...prev, title: event.target.value }))}
              />

              <input
                type="file"
                className="field py-3"
                accept="application/pdf"
                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
              />

              <div className="text-xs text-slate-500">
                {resumeFile ? (
                  <span>Selected file: {resumeFile.name}</span>
                ) : resumeForm.fileUrl ? (
                  <a
                    href={resumeForm.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-slate-700 underline-offset-4 hover:underline"
                  >
                    Open current resume
                  </a>
                ) : (
                  <span>Upload a PDF resume to activate the hero button.</span>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="btn-primary" type="submit">
                Update Resume
              </button>
              <button className="btn-soft" type="button" onClick={resetResumeForm}>
                Reset
              </button>
            </div>
          </form>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-950">Resume Preview</h3>
            <p className="mt-1 text-xs text-slate-500">The hero section uses this file as the resume button target.</p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-900">{resumeForm.title || "Resume"}</p>
              {resumeForm.fileUrl ? (
                <a
                  href={resumeForm.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  View Resume PDF
                </a>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No resume uploaded yet.</p>
              )}
            </div>
          </div>
        </section>

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
                value={projectForm.linkedinLink}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, linkedinLink: event.target.value }))}
              />
              <input
                className="field"
                placeholder="GitHub link"
                value={projectForm.githubLink}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, githubLink: event.target.value }))}
              />
              <input
                className="field"
                placeholder="Live link"
                value={projectForm.liveLink}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, liveLink: event.target.value }))}
              />
              <input
                className="field"
                placeholder="Other link"
                value={projectForm.otherLink}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, otherLink: event.target.value }))}
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
                <option value="achievement">Achievement</option>
              </select>

              <input
                className="field"
                placeholder="Year"
                value={credentialForm.year}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, year: event.target.value }))}
              />

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
                placeholder="Certificate ID"
                value={credentialForm.credential}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, credential: event.target.value }))}
              />

              <input
                className="field sm:col-span-2"
                placeholder="Live certificate URL"
                value={credentialForm.liveUrl}
                onChange={(event) => setCredentialForm((prev) => ({ ...prev, liveUrl: event.target.value }))}
              />

              <input
                type="file"
                className="field sm:col-span-2 py-3"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(event) => setCredentialFile(event.target.files?.[0] || null)}
              />

              <div className="sm:col-span-2 text-xs text-slate-500">
                {credentialFile ? (
                  <span>Selected image: {credentialFile.name}</span>
                ) : credentialForm.fileUrl ? (
                  <div className="space-y-2">
                    <img
                      src={credentialForm.fileUrl}
                      alt="Current certificate"
                      className="h-40 w-full rounded-xl border border-slate-200 object-cover"
                    />
                    <a
                      href={credentialForm.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-slate-700 underline-offset-4 hover:underline"
                    >
                      Open current certificate image
                    </a>
                  </div>
                ) : (
                  <span>Upload a certificate image (optional).</span>
                )}
              </div>

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
            <h3 className="text-xl font-semibold text-slate-950">Certificate List</h3>
            <p className="mt-1 text-xs text-slate-500">Drag and drop cards to reorder certificates.</p>
            <div className="mt-4 space-y-3">
              {certificateItems.map((item) => (
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
                  {item.fileUrl ? (
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      className="mt-3 h-24 w-full rounded-lg border border-slate-200 object-cover"
                    />
                  ) : null}
                  {item.credential || item.liveUrl ? (
                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                      {item.credential ? <p>Certificate ID: {item.credential}</p> : null}
                      {item.liveUrl ? (
                        <a href={item.liveUrl} target="_blank" rel="noreferrer" className="font-medium text-slate-700 underline-offset-4 hover:underline">
                          Live certificate link
                        </a>
                      ) : null}
                    </div>
                  ) : null}
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

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitEducation} className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Education</h2>
            <p className="mt-1 text-sm text-slate-500">Add your education details separately from certificates.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                className="field sm:col-span-2"
                placeholder="Course / Degree Title"
                value={educationForm.title}
                onChange={(event) => setEducationForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />

              <input
                className="field"
                placeholder="Institution"
                value={educationForm.institution}
                onChange={(event) => setEducationForm((prev) => ({ ...prev, institution: event.target.value }))}
              />

              <input
                className="field"
                placeholder="Year"
                value={educationForm.year}
                onChange={(event) => setEducationForm((prev) => ({ ...prev, year: event.target.value }))}
              />

              <input
                className="field sm:col-span-2"
                placeholder="Score/GPA/Percentage"
                value={educationForm.score}
                onChange={(event) => setEducationForm((prev) => ({ ...prev, score: event.target.value }))}
              />

              <textarea
                className="field min-h-28 sm:col-span-2"
                placeholder="Description"
                value={educationForm.description}
                onChange={(event) => setEducationForm((prev) => ({ ...prev, description: event.target.value }))}
              />

              <input
                type="file"
                className="field sm:col-span-2 py-3"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(event) => setEducationImage(event.target.files?.[0] || null)}
              />

              <div className="sm:col-span-2 text-xs text-slate-500">
                {educationImage ? (
                  <span>Selected image: {educationImage.name}</span>
                ) : educationForm.fileUrl ? (
                  <a
                    href={educationForm.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-slate-700 underline-offset-4 hover:underline"
                  >
                    View current education image
                  </a>
                ) : (
                  <span>Upload an education image (optional).</span>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="btn-primary" type="submit">
                {editingEducationId ? "Update Education" : "Add Education"}
              </button>
              {editingEducationId ? (
                <button className="btn-soft" type="button" onClick={resetEducationForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-950">Education List</h3>
            <p className="mt-1 text-xs text-slate-500">Manage your education entries here.</p>
            <div className="mt-4 space-y-3">
              {educationItems.map((item) => (
                <div key={item._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {[item.institution, item.year, item.score].filter(Boolean).join(" • ")}
                  </p>
                  {item.description ? (
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">{item.description}</p>
                  ) : null}
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      View Image
                    </a>
                  ) : null}
                  <div className="mt-3 flex gap-2">
                    <button className="btn-soft" type="button" onClick={() => editEducation(item)}>
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
