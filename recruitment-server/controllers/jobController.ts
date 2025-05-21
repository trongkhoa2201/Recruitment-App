import Job from "../models/job";
import JobLog from "../models/jobLog";
import { Request, Response } from "express";
import mongoose from "mongoose";

const logAction = async ({
  jobId,
  userId,
  action,
  description = "",
}: {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: "create" | "update" | "delete" | "apply";
  description?: string;
}) => {
  try {
    await JobLog.create({ jobId, userId, action, description });
  } catch (err) {
    console.error("Log failed:", err);
  }
};

const getUserIdFromRequest = (req: Request): mongoose.Types.ObjectId => {
  return req.body.userId
    ? new mongoose.Types.ObjectId(req.body.userId)
    : new mongoose.Types.ObjectId();
};

// 🔹 Create
export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.create(req.body);
    const userId = getUserIdFromRequest(req);
    await logAction({
      jobId: job._id,
      userId,
      action: "create",
      description: `Created job: ${job.title}`,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: "Create failed", error: err });
  }
};

// 🔹 Get all
export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err });
  }
};

// 🔹 Get by ID
export const getJobById = async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err: unknown) {
    res
      .status(500)
      .json({ message: "Get failed", error: (err as Error).message });
  }
};
// 🔹 Update
export const updateJob = async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const userId = getUserIdFromRequest(req);
    await logAction({
      jobId: job._id,
      userId,
      action: "update",
      description: `Updated job: ${job.title}`,
    });

    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err });
  }
};

// 🔹 Delete
export const deleteJob = async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const userId = getUserIdFromRequest(req);
    await logAction({
      jobId: job._id,
      userId,
      action: "delete",
      description: `Deleted job: ${job.title}`,
    });

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
};
