import Education from "../models/Education.js";

export async function getEducation(req, res, next) {
  try {
    const education = await Education.find().sort({ order: 1 }).lean();
    res.json(education);
  } catch (err) {
    next(err);
  }
}
