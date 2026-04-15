import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      default: null,
      min: 1,
    },
    skills: [
      {
        name: String,
        icon: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
