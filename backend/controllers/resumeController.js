import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";

const getSignedCloudinaryResumeUrl = (url) => {
  if (!url || !/^https?:\/\//i.test(url)) return "";

  const normalized = String(url).replace(/\\/g, "/").split("?")[0];
  const cloudinaryMatch = normalized.match(
    /^https?:\/\/res\.cloudinary\.com\/[^/]+\/(raw|image)\/upload\/(?:s--[^/]+--\/)?(?:v\d+\/)?(.+)$/i
  );

  if (!cloudinaryMatch) return "";

  const resourceType = cloudinaryMatch[1]?.toLowerCase();
  const assetPath = cloudinaryMatch[2] || "";

  // Restricted Cloudinary accounts can block direct PDF delivery (ACL/deny).
  // private_download_url provides a signed, temporary URL that remains accessible.
  if (resourceType === "raw") {
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    return cloudinary.utils.private_download_url(assetPath, null, {
      resource_type: "raw",
      type: "upload",
      attachment: false,
      expires_at: expiresAt,
    });
  }

  return "";
};

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
    const signedCloudinaryUrl = getSignedCloudinaryResumeUrl(slashNormalized);
    if (signedCloudinaryUrl) {
      return signedCloudinaryUrl;
    }

    return slashNormalized;
  }

  return slashNormalized;
};

const isRestrictedCloudinaryRawUrl = (url) => {
  if (!url) return false;

  return /^https?:\/\/res\.cloudinary\.com\/[^/]+\/raw\/upload\//i.test(String(url));
};

const buildResumeAccessUrl = (resume, req) => {
  const normalized = normalizeResumeFileUrl(resume?.fileUrl, req);
  if (!normalized) return "";

  if (isRestrictedCloudinaryRawUrl(resume?.fileUrl)) {
    return `${req.protocol}://${req.get("host")}/api/resume/current/download`;
  }

  return normalized;
};

export const getCurrentResume = async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ updatedAt: -1 });

    if (!resume) {
      return res.json(null);
    }

    return res.json({
      ...resume.toObject(),
      fileUrl: buildResumeAccessUrl(resume, req),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const downloadCurrentResume = async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ updatedAt: -1 });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found." });
    }

    const resolvedUrl = normalizeResumeFileUrl(resume.fileUrl, req);

    if (!resolvedUrl) {
      return res.status(404).json({ error: "Resume file URL not found." });
    }

    return res.redirect(302, resolvedUrl);
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
    const uploadedFileUrl = req.file?.path
      || (req.file?.filename ? `/uploads/${req.file.filename}` : "");

    const fileUrl = uploadedFileUrl || existingResume?.fileUrl || "";

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
      fileUrl: buildResumeAccessUrl(saved, req),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};