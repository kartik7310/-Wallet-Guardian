  import { Request,Response,NextFunction } from "express";
  import { transactionSchema,TransactionInput,updateTransactionSchema, transactionSearchSchema } from "../Schemas/transaction";
  import prisma from "../config/db";
  import { notifyBudgetThreshold } from "../helper/notifyBudgetThreshold";
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
      // 1️, Fetch budgetif()
  
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
        const user = await tx.user.findUnique({ where: { id: userId } });

        if (user) {
          await notifyBudgetThreshold({
            budgetId: budget.id,
            userEmail: user.email,
            userName: user.name,
            category,
            plannedAmount: budget.plannedAmount,
            spentAmount: budget.spentAmount, // BEFORE increment
            txnAmount: amount,
            month,
            year,
            lastLevel: budget.lastNotifiedLevel,
            txnDate: new Date(date),
          });
        }
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
  //  Validate
  const parse = updateTransactionSchema.safeParse(req.body);
  if (!parse.success) return next(new CustomError("Invalid input", 400));

  const { transactionId } = req.params;
  if (!transactionId) return next(new CustomError("Transaction ID not provided", 400));

  const userId = req.user?.id;
  if (!userId) return next(new CustomError("Unauthorized", 401));

  try {
    const updatedTransaction = await prisma.$transaction(async (tx) => {
      // 1️ Fetch existing transaction
      const existing = await tx.transaction.findUnique({
        where: { id: Number(transactionId), deleted: false },
      });
      if (!existing) return next(new CustomError("Transaction not found", 404));
      if (existing.userId !== userId) return next(new CustomError("Unauthorized", 403));

      // 2️ Resolve new values
      const {
        date = existing.date,
        amount = existing.amount,
        category = existing.category,
        type = existing.type,
        note = existing.note,
      } = parse.data;

      // Parse month / year
      const [oldMonth, oldYear] = [dayjs(existing.date).month() + 1, dayjs(existing.date).year()];
      const [newMonth, newYear] = [dayjs(date).month() + 1, dayjs(date).year()];

      // 3️ Reverse OLD budget impact if old transaction was expense
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
            spentAmount: { decrement: existing.amount },
          },
        });
      }

      // 4️ Update Transaction row
      const updated = await tx.transaction.update({
        where: { id: existing.id },
        data: {
          date,
          amount,
          category,
          type,
          note,
        },
      });

      // 5️ Apply NEW budget impact if new type is expense
      if (type === "expense") {
        const budget = await tx.budget.findUnique({
          where: {
            userId_category_month_year: {
              userId,
              category,
              month: newMonth,
              year: newYear,
            },
          },
        });
        if (!budget) return next(new CustomError("Budget not found for updated transaction", 404));

        const over = budget.spentAmount + amount > budget.plannedAmount;

        await tx.budget.update({
          where: {
            userId_category_month_year: {
              userId,
              category,
              month: newMonth,
              year: newYear,
            },
          },
          data: {
            spentAmount: { increment: amount },
            notified: over ? true : budget.notified,
          },
        });
      }

      return updated;
    });

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (err) {
   next(err);
  }
}

async function DeleteTransaction(req: Request, res: Response, next: NextFunction) {
  const { transactionId } = req.params;
  if (!transactionId) return next(new CustomError("Transaction ID not provided", 400));

  const userId = req.user?.id;
  if (!userId) return next(new CustomError("Unauthorized", 401));

  try {
    const updatedTransaction = await prisma.$transaction(async (tx) => {
      // 1️ Fetch transaction
      const transaction = await tx.transaction.findUnique({
        where: { id: Number(transactionId),deleted:false },
      });

      if (!transaction || transaction.deleted) throw new CustomError("Transaction not found", 404);
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
 // 3️ Soft delete the transaction
      return await tx.transaction.update({
        where: { id: Number(transactionId) },
        data: { deleted: true },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Transaction deleted (soft) successfully",
      data: updatedTransaction,
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