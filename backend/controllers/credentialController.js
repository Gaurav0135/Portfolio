import Credential from "../models/Credential.js";

export const getCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find().sort({ createdAt: -1 });
    credentials.sort((a, b) => {
      const aPriority = Number.isFinite(a.priority) ? a.priority : Number.MAX_SAFE_INTEGER;
      const bPriority = Number.isFinite(b.priority) ? b.priority : Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });
    res.json(credentials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCredential = async (req, res) => {
  try {
    const { title, type, institution, score, year, description, fileUrl, priority } = req.body;

    const credential = new Credential({
      title,
      type,
      institution,
      score,
      year,
      description,
      fileUrl,
      priority: priority ? Number(priority) : null,
    });

    const saved = await credential.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCredential = async (req, res) => {
  try {
    const { title, type, institution, score, year, description, fileUrl, priority } = req.body;

    const updated = await Credential.findByIdAndUpdate(
      req.params.id,
      {
        title,
        type,
        institution,
        score,
        year,
        description,
        fileUrl,
        priority: priority ? Number(priority) : null,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Credential not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCredential = async (req, res) => {
  try {
    const deleted = await Credential.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Credential not found" });
    }

    res.json({ msg: "Credential deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REORDER credentials by ordered ids (priority: 1..n)
export const reorderCredentials = async (req, res) => {
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

    await Credential.bulkWrite(operations);

    const credentials = await Credential.find().sort({ createdAt: -1 });
    credentials.sort((a, b) => {
      const aPriority = Number.isFinite(a.priority) ? a.priority : Number.MAX_SAFE_INTEGER;
      const bPriority = Number.isFinite(b.priority) ? b.priority : Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });

    res.json(credentials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
