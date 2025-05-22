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
  const user = (req as any).user;
  if (user && user.id) {
    return new mongoose.Types.ObjectId(user.id);
  }
  throw new Error("User ID not found in request");
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
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Invalid job ID" });
    return;
  }

  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

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
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Invalid job ID" });
    return;
  }

  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    const userId = getUserIdFromRequest(req);
    await logAction({
      jobId: job._id,
      userId,
      action: "delete",
      description: `Deleted job: ${job.title}`,
    });

    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Delete failed", error: err });
  }
};

// 🔹 Get Applicants for a Job
export const getApplicants = async (req: Request, res: Response): Promise<void> => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    res.status(400).json({ message: "Invalid job ID" });
    return
  }

  try {
    const applicants = await JobLog.find({ jobId, action: "apply" })
      .populate("userId", "name email") // Bạn có thể chỉnh field ở đây
      .sort({ timestamp: -1 });

    res.json(applicants);
  } catch (err) {
    res.status(500).json({ message: "Fetch applicants failed", error: err });
  }
};


// 🔹 Apply Job
export const applyJob = async (req: Request, res: Response): Promise<void> => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    res.status(400).json({ message: "Invalid job ID" });
    return
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return
    }

    const userId = getUserIdFromRequest(req);

    const existingLog = await JobLog.findOne({
      jobId,
      userId,
      action: "apply",
    });

    if (existingLog) {
      res.status(400).json({ message: "You already applied for this job" });
      return
    }

    await logAction({
      jobId: new mongoose.Types.ObjectId(jobId),
      userId,
      action: "apply",
      description: `User ${userId} applied to job ${job.title}`,
    });

    res.json({ message: "Successfully applied to job" });
  } catch (err) {
    res.status(500).json({ message: "Apply failed", error: err });
  }
};
