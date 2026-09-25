import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    technologies: [{ type: String }],
    date: { type: String },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    githubUrl: { type: String, default: null },
    liveUrl: { type: String, default: null },
    image: { type: String, default: null },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
