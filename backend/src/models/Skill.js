import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Programming Languages",
        "Frontend",
        "Backend",
        "Tools",
        "Core CS Knowledge",
      ],
    },
    name: { type: String, required: true },
    proficiency: { type: String }, // optional, only set if explicitly provided
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
