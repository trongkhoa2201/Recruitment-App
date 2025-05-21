import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const role = 'user';

  try {
    if (!["admin", "recruiter"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role });
    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(400).json({
      message: "Email already exists or invalid input",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user: IUser | null = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "2h" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
