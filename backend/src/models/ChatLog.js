import mongoose from "mongoose";

// Optional: store chat interactions for debugging/analytics (no PII beyond the question)
const chatLogSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    retrievedCategories: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model("ChatLog", chatLogSchema);
