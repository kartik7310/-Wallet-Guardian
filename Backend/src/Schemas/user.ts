import { z } from "zod";

// For update
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).max(15).optional(),
  address: z.string().min(5).optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
