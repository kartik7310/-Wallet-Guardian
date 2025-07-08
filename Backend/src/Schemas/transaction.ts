import { z } from "zod";

// Enum for transaction types
export const transactionTypeEnum = z.enum(["income", "expense"]);

// Enum for categories
export const categoryEnum = z.enum([
  "Food",
  "Rent",
  "Salary",
  "Transport",
  "Shopping",
  "Investment",
  "Other",
]);

// Input validation for creating a transaction
export const transactionSchema = z.object({
  type: transactionTypeEnum,
  category: categoryEnum,
  amount: z.number().positive("Amount must be greater than zero"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  note: z.string().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export const updateTransactionSchema = transactionSchema.partial();

//search transaction schema 

export const transactionSearchSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  min: z.string().transform(Number).optional(),
  max: z.string().transform(Number).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  note: z.string().optional(),
}).partial();
