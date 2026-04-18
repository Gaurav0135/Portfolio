import express from "express";
import { upload } from "../middleware/upload.js";
import { getCurrentResume, upsertCurrentResume } from "../controllers/resumeController.js";

const router = express.Router();

router.get("/current", getCurrentResume);
router.put("/current", upload.single("file"), upsertCurrentResume);

export default router;