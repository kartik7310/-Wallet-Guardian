      import { NextFunction, Request,Response } from "express";
      import prisma from "../config/db";
      import { BudgetInput, createBudgetSchema, GetBudgetQuery, getBudgetQuerySchema } from "../Schemas/Budget";
      import { CustomError } from "../utils/customError";

    async function createBudget(req: Request, res: Response, next: NextFunction) {
      const result = createBudgetSchema.safeParse(req.body);
      if (!result.success) {
        return next(new CustomError("Invalid input", 400));
      }

      const userId = req.user?.id;
      if (!userId) {
        return next(new CustomError("Unauthorized", 401));
      }

      const { category, amount, month, year, notes }: BudgetInput = result.data;

      try {
        const existingBudget = await prisma.budget.findUnique({
          where: {
            userId_category_month_year: {
              userId,
              category,
              month,
              year,
            },
          },
        });

        if (existingBudget) {
          return next(
            new CustomError(
              `Budget already exists for ${category} in ${month}/${year}`,
              409
            )
          );
        }

        const budget = await prisma.budget.create({
          data: {
            category,
            plannedAmount: amount,
            month,
            year,
            notes,
            user: {
              connect: { id: userId },
            },
          },
        });

        return res.status(201).json({
          success: true,
          message: "Budget created successfully",
          data: budget,
        });
      } catch (error) {
        next(error);
      }
    }

    async function updateBudget(req: Request, res: Response, next: NextFunction) {
      const result = createBudgetSchema.safeParse(req.body);
      if (!result.success) {  
        return next(new CustomError("Invalid input", 400));
      }
      const userId = req.user?.id;
      if (!userId) {
        return next(new CustomError("Unauthorized", 401));
      }
      const { category, amount, month, year }: BudgetInput = result.data;
      try {
        const existing = await prisma.budget.findUnique({
          where: {
            userId_category_month_year: {
              userId,
              category,
              month,
              year,
            },
          },
        });

        if (!existing) {
          return next(new CustomError("Budget not found. Use create instead.", 404));
        }
    if(userId !== existing?.userId) {
          return next(new CustomError("Unauthorized to update this budget", 403));
        }
        const budget = await prisma.budget.update({
          where: {
            userId_category_month_year: {
              userId,
              category,
              month,
              year,
            },
          },
          data: {
            plannedAmount: amount,
          },
        });

        res.status(200).json({
          success: true,
          message: "Budget updated successfully",
          data: budget,
        });
      } catch (error) {
        next(error);
      }
    }

      async function deleteBudget(req: Request, res: Response, next: NextFunction) {
      const userId = req.user?.id;
      const { budgetId } = req.params;

      if (!userId || !budgetId) return next(new CustomError("Invalid request", 400));

      try {
        const budget = await prisma.budget.findUnique({ where: { id: Number(budgetId) } });

        if (!budget || budget.userId !== userId) {
          return next(new CustomError("Budget not found or unauthorized", 404));
        }

        await prisma.budget.delete({ where: { id: Number(budgetId) } });

        res.status(200).json({
          success: true,
          message: "Budget deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    }

async function GetBudget(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) return next(new CustomError("Unauthorized", 401));

  const parsed = getBudgetQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return next(new CustomError(parsed.error.errors[0].message, 400));
  }

  const { month, year,category }: GetBudgetQuery= parsed.data;

  try {
    const filters: any = { userId };
    if (month) filters.month = Number(month);
    if (year) filters.year = Number(year);
    if (category) filters.category = category;

    const budgets = await prisma.budget.findMany({
      where: filters,
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: budgets.length,
      message: budgets.length ? "Budgets retrieved successfully" : "No budgets found",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
}


export {createBudget,updateBudget,GetBudget,deleteBudget}