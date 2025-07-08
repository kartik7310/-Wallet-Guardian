import { z } from "zod";

//register schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10).max(15),
  address: z.string().min(5, "Address must be valid"),
  
});
export type RegisterInput = z.infer<typeof registerSchema>;

//login schema
export const loginSchema = z.object({
  identifier: z.string().min(10,"Email or phone is required"),
  password: z.string().min(6, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

//send otp input schema 
export const sendOtpSchema = z.object({
  value: z.string(),
  preferredMethod: z.enum(["email", "phone"]),
}).superRefine((data, ctx) => {
  if (data.preferredMethod === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.value)) {
      ctx.addIssue({
        path: ["value"],
        code: z.ZodIssueCode.custom,
        message: "Invalid email address",
      });
    }
  }

  if (data.preferredMethod === "phone") {
    if (!/^\d{10,15}$/.test(data.value)) {
      ctx.addIssue({
        path: ["value"],
        code: z.ZodIssueCode.custom,
        message: "Phone number must be 10–15 digits",
      });
    }
  }
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

//verifyOTP schema
export const verifyOtpSchema = z.object({
  value: z.string(),
  preferredMethod: z.enum(["email", "phone"]),
  token: z.string().length(6, "OTP must be 6 digits"),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

//forgot password schema

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email"),
});
export const verifyForgotOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
});

export type ForgotPasswordRequestInput = z.infer<typeof forgotPasswordRequestSchema>;
export type VerifyForgotOtpInput = z.infer<typeof verifyForgotOtpSchema>;

//resetPassword schema
export const resetPasswordSchema = z.object({
  token: z.string().length(6),
  newPassword: z.string().min(6),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
