import {
  viewProfile,
  updateProfile,
  changePassword,

} from "../Controllers/userController";
import { Router } from "express";

import authMiddleware from "../Middleware/auth";
import catchAsync from "../utils/catchAsync";
const router = Router();

router.get("/me", authMiddleware, catchAsync(viewProfile));
router.put("/me", authMiddleware, catchAsync(updateProfile));
router.patch("/me/password", authMiddleware, catchAsync(changePassword));

export default router;