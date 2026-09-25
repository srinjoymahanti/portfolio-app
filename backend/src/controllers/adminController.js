/**
 * Minimal admin controller for updating portfolio data without touching
 * frontend code. Protected by a simple shared-secret header check
 * (see middleware/adminAuth.js). Not a full auth system by design —
 * upgrade to JWT + login if the portfolio grows beyond single-owner use.
 */
import Profile from "../models/Profile.js";
import Project from "../models/Project.js";

export async function upsertProfile(req, res, next) {
  try {
    const update = req.body;
    const profile = await Profile.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
}
