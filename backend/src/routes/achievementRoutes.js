import { Router } from "express";
import { getAchievements } from "../controllers/achievementController.js";

const router = Router();
router.get("/", getAchievements);

export default router;
