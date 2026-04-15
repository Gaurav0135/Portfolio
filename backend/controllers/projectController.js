import Project from "../models/project.js";

// GET all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    projects.sort((a, b) => {
      const aPriority = Number.isFinite(a.priority) ? a.priority : Number.MAX_SAFE_INTEGER;
      const bPriority = Number.isFinite(b.priority) ? b.priority : Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD project (with image)
export const addProject = async (req, res) => {
  try {
    const { title, description, githubLink, githubLink2, liveLink, techStack, priority } = req.body;

    const project = new Project({
      title,
      description,
      githubLink,
      githubLink2,
      liveLink,
      techStack: techStack
        ? techStack
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      priority: priority ? Number(priority) : null,
      image: req.file ? req.file.path : "",
    });

    const saved = await project.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE project
export const updateProject = async (req, res) => {
  try {
    const { title, description, githubLink, githubLink2, liveLink, techStack, priority } = req.body;

    const updatePayload = {
      title,
      description,
      githubLink,
      githubLink2,
      liveLink,
      techStack: techStack
        ? techStack
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
        priority: priority ? Number(priority) : null,
    };

    if (req.file?.path) {
      updatePayload.image = req.file.path;
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE project
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({ msg: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REORDER projects by ordered ids (priority: 1..n)
export const reorderProjects = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ error: "orderedIds must be a non-empty array" });
    }

    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { priority: index + 1 } },
      },
    }));

    await Project.bulkWrite(operations);

    const projects = await Project.find().sort({ createdAt: -1 });
    projects.sort((a, b) => {
      const aPriority = Number.isFinite(a.priority) ? a.priority : Number.MAX_SAFE_INTEGER;
      const bPriority = Number.isFinite(b.priority) ? b.priority : Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};