import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true },
    message: String,
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);