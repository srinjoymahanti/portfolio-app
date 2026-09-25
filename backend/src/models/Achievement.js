import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String },
    link: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
