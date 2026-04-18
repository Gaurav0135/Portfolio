import Resume from "../models/Resume.js";

const normalizeResumeFileUrl = (url, req) => {
  if (!url) return url;

  const slashNormalized = String(url).replace(/\\/g, "/");

  if (slashNormalized.includes("/public/uploads/")) {
    const fileName = slashNormalized.split("/public/uploads/").pop();
    return `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
  }

  if (slashNormalized.startsWith("public/uploads/")) {
    const fileName = slashNormalized.split("public/uploads/").pop();
    return `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
  }

  if (slashNormalized.startsWith("/uploads/")) {
    return `${req.protocol}://${req.get("host")}${slashNormalized}`;
  }

  if (/^https?:\/\//i.test(slashNormalized)) {
    return slashNormalized;
  }

  return slashNormalized;
};

export const getCurrentResume = async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ updatedAt: -1 });

    if (!resume) {
      return res.json(null);
    }

    return res.json({
      ...resume.toObject(),
      fileUrl: normalizeResumeFileUrl(resume.fileUrl, req),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const upsertCurrentResume = async (req, res) => {
  try {
    if (req.file?.mimetype && req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed for the resume." });
    }

    const { title } = req.body;
    const existingResume = await Resume.findOne().sort({ updatedAt: -1 });
    const fileUrl = req.file?.filename
      ? `/uploads/${req.file.filename}`
      : existingResume?.fileUrl || "";

    if (!fileUrl) {
      return res.status(400).json({ error: "Please upload a resume PDF." });
    }

    const saved = await Resume.findOneAndUpdate(
      existingResume?._id || {},
      {
        title: title || existingResume?.title || "Resume",
        fileUrl,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      ...saved.toObject(),
      fileUrl: normalizeResumeFileUrl(saved.fileUrl, req),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};