import { Router } from "express";
import {
  register,
  login,
  SendOtp,
  verifyOtp,
  forgotPassword,
  resetPasswordViaOtp,
  checkAuth,
  logout,
} from "../Controllers/authController";

import {
  signupLimiter,
  otpLimiter,
  loginLimiter,
  passwordResetLimiter,
} from "../utils/rateLimiter";
import auth from "../Middleware/auth";
import catchAsync from "../utils/catchAsync";

const router = Router();

// Prevent mass bot signups
router.post("/signup", signupLimiter, catchAsync(register));

// Prevent brute force login attacks
router.post("/login", loginLimiter, catchAsync(login));

// Avoid OTP spamming (email/SMS bomb)
router.post("/send-otp", otpLimiter, catchAsync(SendOtp));

//  Prevent OTP brute force guessing
router.post("/verify-otp", otpLimiter, catchAsync(verifyOtp));

//  Prevent forgot-password endpoint abuse
router.post("/forgot-password", passwordResetLimiter, catchAsync(forgotPassword));

//  OTP verified password reset — allow but monitor
router.post("/reset-password", passwordResetLimiter, catchAsync(resetPasswordViaOtp));
router.get("/check",auth , checkAuth);


// router.get("/logout", logout);

export default router;
