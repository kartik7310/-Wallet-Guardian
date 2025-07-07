import {
  Signup,
  login,
  SendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logout,
} from "../Controllers/authController";

import { Router } from "express";

const router = Router();

router.post("/signup", Signup);

router.post("/login", login);

router.post("/send-otp", SendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/logout", logout);

export default router;
