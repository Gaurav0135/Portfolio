import express from "express";
import { sendMessage } from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 protected route
router.post("/", protect, sendMessage);

export default router;