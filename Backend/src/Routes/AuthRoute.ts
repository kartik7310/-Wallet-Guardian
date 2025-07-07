import { Router } from "express";
import {
  register,
  login,
  SendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logout,
} from "../Controllers/authController";
import { signupLimiter } from "../utils/rateLimiter";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.post("/signup", signupLimiter, catchAsync(register));
router.post("/login", catchAsync(login));
router.post("/send-otp", catchAsync(SendOtp));
router.post("/verify-otp", catchAsync(verifyOtp));
// router.post("/forgot-password", catchAsync(forgotPassword));
// router.post("/reset-password", catchAsync(resetPassword));
// router.get("/logout", logout); 
export default router;
