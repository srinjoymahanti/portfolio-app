import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { upsertProfile, createProject, updateProject } from "../controllers/adminController.js";

const router = Router();

router.use(adminAuth);
router.post("/profile", upsertProfile);
router.put("/profile", upsertProfile);
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);

export default router;
