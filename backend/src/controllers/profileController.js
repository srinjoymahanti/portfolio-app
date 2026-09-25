import Profile from "../models/Profile.js";

export async function getProfile(req, res, next) {
  try {
    const profile = await Profile.findOne().lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
}
