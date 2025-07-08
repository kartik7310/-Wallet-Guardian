import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import {
  registerSchema,
  RegisterInput,
  SendOtpInput,
  sendOtpSchema,
  verifyOtpSchema,
  VerifyOtpInput,
  loginSchema,
  LoginInput,
  forgotPasswordRequestSchema,
  verifyForgotOtpSchema,
} from "../Schemas/auth";
import { GenerateOtp } from "../utils/generateOtp";
import prisma from "../config/db";
import { decode, HashedPassword } from "../utils/hashPassword";

import { generateJWTToken } from "../utils/jwt";
import { ResetPasswordSuccess, sendVerificationEmail, welcomeEmail} from "../utils/verificationEmail";

async function register(req: Request, res: Response, next: NextFunction) {
  const result = registerSchema.safeParse(req.body);
  
  if (!result.success) {
    return next(new CustomError("validation failed", 400));
  }
  const data: RegisterInput = result?.data;
   console.log(" data is here",data);
  if (data?.password !== data?.confirmPassword) {
    return next(new CustomError("Password or ConfirmPassword should be same"));
  }
  try {
    const verifiedOtp = await prisma.oTP.findFirst({
      where: {
        identifier: data?.email,
        verified: true,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verifiedOtp) {
      return next(new CustomError("Please verify your OTP first", 401));
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });
    if (existingUser) {
      return next(new CustomError("User is already exist", 400));
    }
    const hashPassword = await HashedPassword(data?.password);
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
        phone: data.phone,
        address: data.address,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return next(new CustomError("Invalid input", 400));
  }
  const data: LoginInput = result?.data;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data?.identifier }, { phone: data?.identifier }],
      },
    });
    if (!existingUser) {
      return next(new CustomError("user not exist ,Please signup first", 404));
    }
    const isPasswordMatch = await decode({
      plainPassword: data?.password,
      hashPassword: existingUser?.password,
    });
    if (!isPasswordMatch) {
      if (data.identifier === "email") {
        return next(new CustomError("invalid email or password"));
      } else {
        return next(new CustomError("invalid phone or password"));
      }
    }
    const token = await generateJWTToken({
      id: existingUser?.id,
      email: existingUser?.email,
    });
     
    if (!token) {
      return next(new CustomError("token not created", 400));
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    await welcomeEmail(existingUser.name,existingUser.email)
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}

async function SendOtp(req: Request, res: Response, next: NextFunction) {
  const result = sendOtpSchema.safeParse(req.body);
  if (!result.success) {
    return next(new CustomError("Invalid input", 400));
  }
  const data: SendOtpInput = result?.data;
  try {
    const Otp = GenerateOtp();
    if (!Otp) {
      return next(new CustomError("Otp not created", 400));
    }

 
  const tokenData = await prisma.oTP.create({
  data: {
    identifier: data.value,
    method: data.preferredMethod,
    token: Otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
  },
});

const {identifier,token} = tokenData;
   await sendVerificationEmail({email:identifier,token})
    return res.status(200).json({
      success: true,
      message: `OTP sent via ${data.preferredMethod}`,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  const result = verifyOtpSchema.safeParse(req.body);
  if (!result.success) {
    return next(new CustomError("Invalid input", 400));
  }

  const data: VerifyOtpInput = result.data;

  try {
    const existingValue = await prisma.oTP.findFirst({
      where: {
        identifier: data.value,
        method: data.preferredMethod,
        token: data.token,
        verified: false,
      },
    });

    if (!existingValue) {
      return next(new CustomError("OTP not found or incorrect", 404));
    }

    if (new Date() > existingValue.expiresAt) {
      return next(new CustomError("OTP has expired", 400));
    }

    // update data base and mark verify true
    await prisma.oTP.update({
      where: { id: existingValue.id },
      data: { verified: true },
    });
    return res.status(200).json({
  success: true,
  message: "OTP verified successfully",
  
});

  } catch (error) {
    next(error);
  }
}

 async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  const result = forgotPasswordRequestSchema.safeParse(req.body);
  if (!result.success) return next(new CustomError("Invalid input", 400));
  const { email } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(new CustomError("User not found", 404));

    const otp = GenerateOtp(); // 6-digit code
   if(!otp){
    return next(new CustomError('otp not create'))
   }
    await prisma.oTP.create({
      data: {
        identifier: email,
        method: "email",
        token: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
      },
    });

    await sendVerificationEmail({ email, token: otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email for password reset",
    });
  } catch (err) {
    next(err);
  }
}

 async function resetPasswordViaOtp(req: Request, res: Response, next: NextFunction) {
  const result = verifyForgotOtpSchema.safeParse(req.body);
  if (!result.success) return next(new CustomError("Invalid input", 400));

  const { email, otp, password, confirmPassword } = result.data;
  if (password !== confirmPassword) {
    return next(new CustomError("Password and Confirm Password must match", 400));
  }

  try {
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        identifier: email,
        token: otp,
        verified: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otpRecord) {
      return next(new CustomError("Invalid or expired OTP", 400));
    }

    const hashed = await HashedPassword(password);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    // ✅ Mark OTP as used (optional) or delete
    await prisma.oTP.delete({ where: { id: otpRecord.id } });
    await ResetPasswordSuccess(updatedUser?.name,updatedUser?.email)
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
}


function logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

export { register, login, SendOtp, verifyOtp ,logout,forgotPassword,resetPasswordViaOtp};
