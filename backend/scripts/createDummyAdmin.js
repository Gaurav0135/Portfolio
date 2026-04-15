import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.DUMMY_ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.DUMMY_ADMIN_PASSWORD || "Admin@123";
    const adminName = process.env.DUMMY_ADMIN_NAME || "Dummy Admin";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("Dummy admin account is ready.");
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${adminPassword}`);
  } catch (err) {
    console.error("Failed to create dummy admin account:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
