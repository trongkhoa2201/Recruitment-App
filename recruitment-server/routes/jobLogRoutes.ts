import express from "express";
import { getJobLogsByUserId } from "../controllers/getJobLogsByUserId";
import { authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authorizeRoles("recruiter"), getJobLogsByUserId);

export default router;
