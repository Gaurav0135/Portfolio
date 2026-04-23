import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

// Ensure public uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CloudinaryStorage for images
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "portfolio",
      resource_type: "auto",
      type: "upload",
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

// Local disk storage for PDFs
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + "-" + uniqueSuffix + ext);
  },
});

// Custom storage that routes files based on type
const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // For PDFs, use disk storage; for images, we'll handle via Cloudinary
    if (file.mimetype === "application/pdf") {
      cb(null, uploadsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + "-" + uniqueSuffix + ext);
  },
});

// Create separate upload instances
const uploadToCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, true); // Allow all for now, let Cloudinary filter
    }
  },
});

const uploadToDisk = multer({
  storage: customStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, true);
    }
  },
});

// Dedicated Cloudinary storage for resume PDFs (raw delivery)
const resumeCloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname || "").replace(".", "").toLowerCase();

    return {
      folder: "portfolio/resumes",
      resource_type: "raw",
      type: "upload",
      format: ext || "pdf",
    };
  },
});

const uploadResumeToCloudinary = multer({
  storage: resumeCloudinaryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
      return;
    }

    cb(new Error("Only PDF files are allowed for the resume."));
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Export a combined upload middleware
export const upload = uploadToDisk;
export const uploadResume = uploadResumeToCloudinary;