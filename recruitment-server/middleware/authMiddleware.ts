import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: string;
}

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      Array.isArray(authHeader) ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      if (!roles.includes(decoded.role)) {
        res.status(403).json({ message: "Forbidden: insufficient rights" });
        return;
      }

      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  };
};
