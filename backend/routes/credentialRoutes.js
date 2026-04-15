import express from "express";
import {
  getCredentials,
  addCredential,
  updateCredential,
  deleteCredential,
  reorderCredentials,
} from "../controllers/credentialController.js";

const router = express.Router();

router.get("/", getCredentials);
router.post("/", addCredential);
router.put("/reorder", reorderCredentials);
router.put("/:id", updateCredential);
router.delete("/:id", deleteCredential);

export default router;
