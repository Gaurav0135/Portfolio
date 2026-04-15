import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["certificate", "marksheet", "education", "achievement"],
      default: "certificate",
    },
    institution: {
      type: String,
      default: "",
      trim: true,
    },
    score: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    fileUrl: {
      type: String,
      default: "",
      trim: true,
    },
    priority: {
      type: Number,
      default: null,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Credential", credentialSchema);
