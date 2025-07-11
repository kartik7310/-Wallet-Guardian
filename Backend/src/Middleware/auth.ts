import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET !;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    return next(new CustomError("Unauthorized", 401));
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as UserPayload;
    if (!user || !user.id) {
      return next(new CustomError("Unauthorized", 401));
    }
    console.log("auth middleware user:", user);
    
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return next(new CustomError("Invalid token", 401));
  }
}

export default auth;
