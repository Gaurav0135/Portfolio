import express from "express";
import {
  getCredentials,
  addCredential,
  updateCredential,
  deleteCredential,
  reorderCredentials,
} from "../controllers/credentialController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCredentials);
router.post("/", upload.single("file"), addCredential);
router.put("/reorder", reorderCredentials);
router.put("/:id", upload.single("file"), updateCredential);
router.delete("/:id", deleteCredential);

export default router;
