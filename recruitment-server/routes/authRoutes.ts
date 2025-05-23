import express, { Router } from "express";
import { register, login } from "../controllers/authController";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";

const router: Router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body('password').notEmpty().withMessage("Password is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("role")
      .isIn(["user", "recruiter"])
      .withMessage("Role must be either user or recruiter"),
      validateRequest,
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

export default router;
