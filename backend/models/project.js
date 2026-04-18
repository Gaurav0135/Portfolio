import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    linkedinLink: String,
    githubLink: String,
    githubLink2: String,
    liveLink: String,
    otherLink: String,
    techStack: [String],
    priority: {
      type: Number,
      default: null,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);