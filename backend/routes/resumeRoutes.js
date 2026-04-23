import express from "express";
import { uploadResume } from "../middleware/upload.js";
import {
	downloadCurrentResume,
	getCurrentResume,
	upsertCurrentResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.get("/current", getCurrentResume);
router.get("/current/download", downloadCurrentResume);
router.put("/current", uploadResume.single("file"), upsertCurrentResume);

export default router;