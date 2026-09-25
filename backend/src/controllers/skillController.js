import Skill from "../models/Skill.js";

export async function getSkills(req, res, next) {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 }).lean();
    res.json(skills);
  } catch (err) {
    next(err);
  }
}
