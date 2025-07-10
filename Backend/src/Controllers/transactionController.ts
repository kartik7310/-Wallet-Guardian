  import { Request,Response,NextFunction } from "express";
  import { transactionSchema,TransactionInput,updateTransactionSchema, transactionSearchSchema } from "../Schemas/transaction";
  import prisma from "../config/db";
  import { CustomError } from "../utils/customError";
  import { buildTransactionFilter } from "../helper/searchFilter";
  import dayjs from "dayjs";

async function CreateTransaction(req: Request, res: Response, next: NextFunction) {
  const result = transactionSchema.safeParse(req.body);
  if (!result.success) return next(new CustomError("Invalid input", 400));

  const userId = req.user?.id;
  if (!userId) return next(new CustomError("Unauthorized", 401));

  const { type, category, amount, date, note }: TransactionInput = result.data;

  const month = dayjs(date).month() + 1;
  const year = dayjs(date).year();

  try {
    const createdTransaction = await prisma.$transaction(async (tx) => {
      // 1️, Fetch budget
      const budget = await tx.budget.findUnique({
        where: {
          userId_category_month_year: {
            userId,
            category,
            month,
            year,
          },
        },
      });

      if (!budget) {
        return next(new CustomError("Budget not set for this category/month/year", 403));
      }

      const isOverBudget =
        type === "expense" && budget.spentAmount + amount > budget.plannedAmount;

      if (isOverBudget) {
        console.warn("User exceeded the budget");
        return next(new CustomError("You have exceeded your budget for this category", 403));
        //  trigger notifications here (inside or outside transaction)
      }

      // 2️, Create transaction
      const transaction = await tx.transaction.create({
        data: {
          type,
          category,
          amount,
          date: new Date(date),
          note,
          user: { connect: { id: userId } },
        },
      });

      // 3️, Update budget (only for expense)
      if (type === "expense") {
        await tx.budget.update({
          where: {
            userId_category_month_year: {
              userId,
              category,
              month,
              year,
            },
          },
          data: {
            spentAmount: {
              increment: amount,
            },
            notified: isOverBudget ? true : budget.notified,
          },
        });
      }

      return transaction;
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: createdTransaction,
    });
  } catch (error) {
    next(error);  
  }
}

  
async function UpdateTransaction(req: Request, res: Response, next: NextFunction) {
  const result = updateTransactionSchema.safeParse(req.body);
  if (!result.success) {
    return next(new CustomError("Invalid input", 400));
  }

  const { transactionId } = req.params;
  if (!transactionId) {
    return next(new CustomError("Transaction ID not provided", 400));
  }

  const userId = req.user?.id;
  if (!userId) {
    return next(new CustomError("User ID not found in request", 400));
  }

  try {
    const updatedTransaction = await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { id: Number(transactionId) },
      });

      if (!existing) {
        throw new CustomError("Transaction not found", 404);
      }

      if (existing.userId !== userId) {
        throw new CustomError("Unauthorized to update this transaction", 403);
      }

      const oldMonth = dayjs(existing.date).month() + 1;
      const oldYear = dayjs(existing.date).year();

      const newDate = result.data.date || existing.date;
      const newMonth = dayjs(newDate).month() + 1;
      const newYear = dayjs(newDate).year();

      const newCategory = result.data.category || existing.category;
      const newAmount = result.data.amount || existing.amount;
      const newType = result.data.type || existing.type;

      // 1️ Reverse the old budget spentAmount if it was expense
      if (existing.type === "expense") {
        await tx.budget.update({
          where: {
            userId_category_month_year: {
              userId,
              category: existing.category,
              month: oldMonth,
              year: oldYear,
            },
          },
          data: {
            spentAmount: {
              decrement: existing.amount,
            },
          },
        });
      }

      // 2️ Apply the new transaction update
      const updated = await tx.transaction.update({
        where: { id: Number(transactionId) },
        data: {
          ...result.data,
          date: result.data.date ? new Date(result.data.date) : undefined,
        },
      });

      // 3️ Apply the new budget spentAmount if expense
      if (newType === "expense") {
        const budget = await tx.budget.findUnique({
          where: {
            userId_category_month_year: {
              userId,
              category: newCategory,
              month: newMonth,
              year: newYear,
            },
          },
        });

        if (!budget) {
          throw new CustomError("Budget not found for updated transaction details", 404);
        }

        const isOverBudget = budget.spentAmount + newAmount > budget.plannedAmount;

        await tx.budget.update({
          where: {
            userId_category_month_year: {
              userId,
              category: newCategory,
              month: newMonth,
              year: newYear,
            },
          },
          data: {
            spentAmount: {
              increment: newAmount,
            },
            notified: isOverBudget ? true : budget.notified,
          },
        });
      }

      return updated;
    });

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Internal Server Error", 500));
  }
}

async function DeleteTransaction(req: Request, res: Response, next: NextFunction) {
  const { transactionId } = req.params;
  if (!transactionId) return next(new CustomError("Transaction ID not provided", 400));

  const userId = req.user?.id;
  if (!userId) return next(new CustomError("Unauthorized", 401));

  try {
    const deletedTransaction = await prisma.$transaction(async (tx) => {
      // 1️ Fetch transaction
      const transaction = await tx.transaction.findUnique({
        where: { id: Number(transactionId) },
      });

      if (!transaction) throw new CustomError("Transaction not found", 404);
      if (transaction.userId !== userId) throw new CustomError("Unauthorized", 403);

      const { type, amount, date, category } = transaction;
      const month = dayjs(date).month() + 1;
      const year = dayjs(date).year();

      // 2️ Reverse budget impact if expense
      if (type === "expense") {
        const budget = await tx.budget.findUnique({
          where: {
            userId_category_month_year: {
              userId,
              category,
              month,
              year,
            },
          },
        });

        if (budget) {
          await tx.budget.update({
            where: {
              userId_category_month_year: {
                userId,
                category,
                month,
                year,
              },
            },
            data: {
              spentAmount: {
                decrement: amount,
              },
            },
          });
        }
      }

      // 3️ Delete transaction
      return await tx.transaction.delete({
        where: { id: Number(transactionId) },
      });
    });

  
    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    next(error);
  }
}

 async function GetAllTransaction(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) return next(new CustomError("User not authenticated", 401));

  const result = transactionSearchSchema.safeParse(req.query);
  if (!result.success) {
    return next(new CustomError("Invalid search parameters", 400));
  }

  try {
    const filters = result.data;
    const whereClause = buildTransactionFilter(userId, filters);

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
}

export{CreateTransaction,UpdateTransaction,DeleteTransaction,GetAllTransaction}