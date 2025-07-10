import rateLimit from "express-rate-limit";

// General low-security limiter
export const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many sign-up attempts. Please try again later.",
});

// Strong limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 6,
  message: "Too many login attempts. Try again after 5 minutes.",
});

// OTP send/verify limiter to prevent abuse
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 6, // 4 OTP actions in 10 min
  message: "Too many OTP requests. Try again later.",
});

// Forgot/reset password limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: "Too many password reset attempts. Try again later.",
});
