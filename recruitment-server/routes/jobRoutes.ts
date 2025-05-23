import express from "express";
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  applyJob,
  getApplicants,
  deleteJobsBulk,
} from "../controllers/jobController";
import { authorizeRoles } from "../middleware/authMiddleware";
import { body, param } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

router.post(
  "/",
  authorizeRoles("recruiter"),
  [
    body("title").notEmpty().withMessage("Job title is required"),
    body("description").notEmpty().withMessage("Job description is required"),
    body("tags").notEmpty().withMessage("Job tags is required"),
    validateRequest,
  ],
  createJob
);

router.get("/", getJobs);

router.put(
  "/:id",
  authorizeRoles("recruiter"),
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    body("title")
      .optional()
      .notEmpty()
      .withMessage("Job title cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Job description cannot be empty"),
    body("tags")
      .optional()
      .notEmpty()
      .withMessage("Tags cannot be empty"),
    validateRequest,
  ],
  updateJob
);

router.delete(
  "/:id",
  authorizeRoles("recruiter"),
  [param("id").isMongoId().withMessage("Invalid job ID"), validateRequest],
  deleteJob
);

router.post(
  "/delete-bulk",
  authorizeRoles("recruiter"),
  [
    body("jobIds")
      .isArray({ min: 1 })
      .withMessage("jobIds must be an array with at least one ID"),
    body("jobIds.*")
      .isMongoId()
      .withMessage("Each jobId must be a valid Mongo ID"),
    validateRequest,
  ],
  deleteJobsBulk
);

router.post(
  "/:id/apply",
  authorizeRoles("user"),
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    validateRequest,
  ],
  applyJob
);

router.get(
  "/:id/applicants",
  authorizeRoles("recruiter"),
  [param("id").isMongoId().withMessage("Invalid job ID"), validateRequest],
  getApplicants
);

export default router;