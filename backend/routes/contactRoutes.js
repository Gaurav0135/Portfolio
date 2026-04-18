import express from "express";
import { sendMessage } from "../controllers/contactController.js";

const router = express.Router();

// Public contact route so visitors can submit the form without login
router.post("/", sendMessage);

export default router;