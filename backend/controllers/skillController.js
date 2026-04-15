import Skill from "../models/Skill.js";

// GET all skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    skills.sort((a, b) => {
      const aPriority = Number.isFinite(a.priority) ? a.priority : Number.MAX_SAFE_INTEGER;
      const bPriority = Number.isFinite(b.priority) ? b.priority : Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD skill category
export const addSkill = async (req, res) => {
  try {
    const { category, skills, priority } = req.body;
    const skill = new Skill({
      category,
      priority: priority ? Number(priority) : null,
      skills: Array.isArray(skills) ? skills : [],
    });
    const saved = await skill.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE skill category
export const updateSkill = async (req, res) => {
  try {
    const { category, skills, priority } = req.body;

    const updated = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        category,
        priority: priority ? Number(priority) : null,
        skills: Array.isArray(skills) ? skills : [],
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Skill category not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE skill category
export const deleteSkill = async (req, res) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Skill category not found" });
    }

    res.json({ msg: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REORDER skills by ordered ids (priority: 1..n)
export const reorderSkills = async (req, res) => {
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

    await Skill.bulkWrite(operations);

    const skills = await Skill.find().sort({ createdAt: 1 });
    skills.sort((a, b) => {
      const aPriority = Number.isFinite(a.priority) ? a.priority : Number.MAX_SAFE_INTEGER;
      const bPriority = Number.isFinite(b.priority) ? b.priority : Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });

    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
