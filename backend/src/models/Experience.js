import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String },
    technologies: [{ type: String }],
    startDate: { type: String },
    endDate: { type: String },
    location: { type: String },
    achievements: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
