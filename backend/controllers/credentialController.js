import Credential from "../models/Credential.js";

const normalizeCredentialAssetUrl = (url, req) => {
  if (!url) return url;

  // Normalize local disk paths like public\uploads\file.jpg to /uploads/file.jpg
  const slashNormalized = String(url).replace(/\\/g, "/");
  if (slashNormalized.includes("/public/uploads/")) {
    const fileName = slashNormalized.split("/public/uploads/").pop();
    const relativePath = `/uploads/${fileName}`;
    return `${req.protocol}://${req.get("host")}${relativePath}`;
  }

  if (slashNormalized.startsWith("public/uploads/")) {
    const fileName = slashNormalized.split("public/uploads/").pop();
    const relativePath = `/uploads/${fileName}`;
    return `${req.protocol}://${req.get("host")}${relativePath}`;
  }

  if (slashNormalized.startsWith("/uploads/")) {
    return `${req.protocol}://${req.get("host")}${slashNormalized}`;
  }

  // Keep remote URLs unchanged (Cloudinary/live links, etc.)
  if (/^https?:\/\//i.test(slashNormalized)) {
    return slashNormalized;
  }

  return slashNormalized;
};

export const getCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find().sort({ createdAt: -1 });
    credentials.sort((a, b) => {
      const aPriority = Number.isFinite(a.priority) ? a.priority : Number.MAX_SAFE_INTEGER;
      const bPriority = Number.isFinite(b.priority) ? b.priority : Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });
    
    // Transform file URLs to ensure public delivery
    const credentialsWithPublicUrls = credentials.map((cred) => ({
      ...cred.toObject(),
      fileUrl: normalizeCredentialAssetUrl(cred.fileUrl, req),
    }));
    
    res.json(credentialsWithPublicUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCredential = async (req, res) => {
  try {
    const { title, type, institution, score, year, description, credential: credentialValue, liveUrl, fileUrl } = req.body;
    const normalizedType = (type || "certificate").toLowerCase();

    if (req.file?.mimetype && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Only image files are allowed for certificates." });
    }

    const uploadedFileUrl = req.file?.filename ? `/uploads/${req.file.filename}` : fileUrl || "";

    const credential = new Credential({
      title,
      type: normalizedType,
      institution,
      score,
      year,
      description,
      credential: credentialValue,
      liveUrl,
      fileUrl: uploadedFileUrl,
      priority: null,
    });

    const saved = await credential.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCredential = async (req, res) => {
  try {
    const { title, type, institution, score, year, description, credential: credentialValue, liveUrl, fileUrl } = req.body;
    const normalizedType = (type || "certificate").toLowerCase();
    const existingCredential = await Credential.findById(req.params.id);

    if (req.file?.mimetype && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Only image files are allowed for certificates." });
    }

    if (!existingCredential) {
      return res.status(404).json({ msg: "Credential not found" });
    }

    const uploadedFileUrl = req.file?.filename
      ? `/uploads/${req.file.filename}`
      : fileUrl || existingCredential.fileUrl || "";

    const updated = await Credential.findByIdAndUpdate(
      req.params.id,
      {
        title,
        type: normalizedType,
        institution,
        score,
        year,
        description,
        credential: credentialValue,
        liveUrl,
        fileUrl: uploadedFileUrl,
        priority: existingCredential.priority,
      },
      { new: true, runValidators: true }
    );

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
