import express from "express";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from "../controllers/skillController.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/", addSkill);
router.put("/reorder", reorderSkills);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
