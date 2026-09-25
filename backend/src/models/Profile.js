import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    headline: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String },
    email: { type: String },
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
