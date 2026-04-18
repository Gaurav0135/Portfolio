import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import dns from "dns";
import connectDB from "./config/db.js";

import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import credentialRoutes from "./routes/credentialRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});