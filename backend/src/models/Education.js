import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String },
    cgpa: { type: String },
    startYear: { type: String },
    endYear: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Education", educationSchema);
