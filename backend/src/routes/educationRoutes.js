import { Router } from "express";
import { getEducation } from "../controllers/educationController.js";

const router = Router();
router.get("/", getEducation);

export default router;
