import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Project from "../models/project.js";
import Skill from "../models/Skill.js";
import Credential from "../models/Credential.js";
import Contact from "../models/contact.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const LOCAL_DB = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";
const ATLAS_DB = process.env.MONGO_URI;

async function migrateData() {
  try {
    if (!ATLAS_DB) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    console.log("🔄 Starting data migration...\n");

    // Connect to local database
    console.log("📍 Connecting to local MongoDB...");
    await mongoose.connect(LOCAL_DB);
    console.log("✅ Connected to local MongoDB\n");

    // Fetch all data from local database
    console.log("📤 Reading data from local database...");
    const projects = await Project.find();
    const skills = await Skill.find();
    const credentials = await Credential.find();
    const contacts = await Contact.find();
    const resumes = await Resume.find();
    const users = await User.find();

    console.log(`  ✓ Projects: ${projects.length}`);
    console.log(`  ✓ Skills: ${skills.length}`);
    console.log(`  ✓ Credentials: ${credentials.length}`);
    console.log(`  ✓ Contacts: ${contacts.length}`);
    console.log(`  ✓ Resumes: ${resumes.length}\n`);
    console.log(`  ✓ Users: ${users.length}\n`);

    // Disconnect from local
    await mongoose.disconnect();
    console.log("✅ Disconnected from local MongoDB\n");

    // Connect to Atlas with extended timeouts and direct connection
    console.log("☁️  Connecting to MongoDB Atlas...");
    try {
      const atlasConnection = await mongoose.connect(ATLAS_DB, {
        serverSelectionTimeoutMS: 60000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 60000,
        retryWrites: true,
        w: 'majority',
        authSource: 'admin'
      });
      console.log("✅ Connected to MongoDB Atlas\n");
    } catch (error) {
      console.error("❌ Atlas connection failed:", error.message);
      if (error.code === 'ENOTFOUND') {
        console.error("\n⚠️  DNS resolution failed. Possible causes:");
        console.error("  - Firewall or antivirus blocking MongoDB traffic");
        console.error("  - ISP DNS issues - try using public DNS (8.8.8.8)");
        console.error("  - Network connectivity issue");
      }
      throw error;
    }

    // Replace existing Atlas data with the local snapshot.
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Credential.deleteMany({});
    await Contact.deleteMany({});
    await Resume.deleteMany({});
    await User.deleteMany({});

    // Insert data to Atlas
    console.log("📥 Uploading data to MongoDB Atlas...");
    
    if (projects.length > 0) {
      await Project.insertMany(projects);
      console.log(`  ✓ Uploaded ${projects.length} projects`);
    }

    if (skills.length > 0) {
      await Skill.insertMany(skills);
      console.log(`  ✓ Uploaded ${skills.length} skill categories`);
    }

    if (credentials.length > 0) {
      await Credential.insertMany(credentials);
      console.log(`  ✓ Uploaded ${credentials.length} credentials`);
    }

    if (contacts.length > 0) {
      await Contact.insertMany(contacts);
      console.log(`  ✓ Uploaded ${contacts.length} contact messages`);
    }

    if (resumes.length > 0) {
      await Resume.insertMany(resumes);
      console.log(`  ✓ Uploaded ${resumes.length} resumes`);
    }

    if (users.length > 0) {
      await User.insertMany(users);
      console.log(`  ✓ Uploaded ${users.length} users`);
    }

    console.log("\n✅ Migration completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Migration failed:", err.message);
    process.exit(1);
  }
}

migrateData();
