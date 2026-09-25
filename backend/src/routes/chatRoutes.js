import { Router } from "express";
import { body } from "express-validator";
import { postChat } from "../controllers/chatController.js";
import { validate } from "../middleware/validate.js";
import { chatLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/",
  chatLimiter,
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("message is required")
      .isLength({ max: 500 })
      .withMessage("message must be under 500 characters")
      .escape(),
  ],
  validate,
  postChat
);

export default router;
