import express from "express";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "../controllers/projectController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", upload.single("image"), addProject);
router.put("/reorder", reorderProjects);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;