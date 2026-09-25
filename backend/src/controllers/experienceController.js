import Experience from "../models/Experience.js";

export async function getExperience(req, res, next) {
  try {
    const experience = await Experience.find().sort({ order: 1 }).lean();
    res.json(experience);
  } catch (err) {
    next(err);
  }
}
