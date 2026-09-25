import { Router } from "express";
import { body } from "express-validator";
import { postContact } from "../controllers/contactController.js";
import { validate } from "../middleware/validate.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/",
  contactLimiter,
  [
    body("name").trim().notEmpty().withMessage("name is required").escape(),
    body("email").trim().isEmail().withMessage("a valid email is required").normalizeEmail(),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("message is required")
      .isLength({ max: 2000 })
      .withMessage("message must be under 2000 characters")
      .escape(),
  ],
  validate,
  postContact
);

export default router;
