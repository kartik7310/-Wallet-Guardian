import { z } from "zod";

export const createBudgetSchema = z.object({
  category: z.enum(["Food", "Rent", "Salary", "Transport", "Shopping", "Investment", "Other"]),
  amount: z.number().positive(),
  month: z.number().min(1).max(12),
  notes: z.string().optional().nullable(),
  year: z.number().min(2020).max(2100)
});

export type BudgetInput = z.infer<typeof createBudgetSchema>;




export const getBudgetQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d+$/, "Month must be a number")
    .transform(Number)
    .refine((val) => val >= 1 && val <= 12, {
      message: "Month must be between 1 and 12",
    })
    .optional(),

  year: z
    .string()
    .regex(/^\d+$/, "Year must be a number")
    .transform(Number)
    .refine((val) => val >= 2000 && val <= new Date().getFullYear() + 5, {
      message: "Invalid year",
    })
    .optional(),
  category: z
    .enum(["Food", "Rent", "Salary", "Transport", "Shopping", "Investment", "Other"])
    .optional(),
});
export type GetBudgetQuery = z.infer<typeof getBudgetQuerySchema>;