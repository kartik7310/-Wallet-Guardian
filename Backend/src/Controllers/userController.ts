import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { CustomError } from "../utils/customError";
import { decode, HashedPassword } from "../utils/hashPassword";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../Schemas/user"; 

export async function viewProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new CustomError("Unauthorized", 401));

    const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    name: true,
    email: true,
    phone: true,
    address: true,
    budgets: {
      select: {
        category: true,
        plannedAmount: true,
        spentAmount: true,
        month: true,
        year: true,
      },
    },
    transactions: {
      take: 5,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        amount: true,
        category: true,
        type: true,
        date: true,
      },
    },
  },
});


    if (!user) return next(new CustomError("User not found", 404));

    // Generate initials
    const initials = user.name
      .split(" ")
      .map((n:string) => n[0])
      .join("")
      .toUpperCase();

    return res.status(200).json({
      success: true,
      data: { ...user, initials },
    });
  } catch (err) {
    next(err);
  }
}


export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  const result = updateProfileSchema.safeParse(req.body);
  if (!result.success) return next(new CustomError("Invalid input", 400));

  try {
    const userId = req.user?.id;
    if (!userId) return next(new CustomError("Unauthorized", 401));

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: result.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

// 3️ Change Password
export async function changePassword(req: Request, res: Response, next: NextFunction) {
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) return next(new CustomError("Invalid input", 400));
const { oldPassword, newPassword ,confirmPassword} = result.data;
      if (newPassword !== confirmPassword) {
      return next(new CustomError("Passwords do not match", 400));
      }
  try {
    const userId = req.user?.id;
    if (!userId) return next(new CustomError("Unauthorized", 401));

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next(new CustomError("User not found", 404));

    const isOldPasswordValid = await decode({plainPassword:oldPassword,hashPassword: user.password});
    if (!isOldPasswordValid) return next(new CustomError("Old password is incorrect", 400));

    const hashedPassword = await HashedPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
}
