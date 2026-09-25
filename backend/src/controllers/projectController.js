import Project from "../models/Project.js";

export async function getProjects(req, res, next) {
  try {
    const projects = await Project.find().sort({ order: 1 }).lean();
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
}
