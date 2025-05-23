import { Request, Response } from "express";
import mongoose from "mongoose";
import JobLog from "../models/jobLog";

const getUserIdFromRequest = (req: Request): mongoose.Types.ObjectId => {
  const user = (req as any).user;
  if (user && user.id) {
    return new mongoose.Types.ObjectId(user.id);
  }
  throw new Error("User ID not found in request");
};

export const getJobLogsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const logs = await JobLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    console.error("Failed to get job logs:", error);
    res
      .status(401)
      .json({
        message: error instanceof Error ? error.message : "Unauthorized",
      });
  }
};
