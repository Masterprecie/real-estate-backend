import userModel from "../models/userModel";
import { generateCode } from "../utils/generateCode";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import validateAuth from "../utils/validations";
import { Request, Response, NextFunction } from "express";
import sendEmail from "../utils/emailUtils";
import { generateToken } from "../utils/jwt";
import { AuthenticatedRequest, User } from "../types/user";
import userTokenModel from "../models/userToken";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const error = validateAuth(req.body);
    if (error) {
      res.status(400).json({
        message: error.details[0].message,
      });
      return;
    }
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      sendErrorResponse(res, 400, "User with this email already exists");
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const { code, expiresAt }: { code: string; expiresAt: Date } =
      generateCode();

    await userTokenModel.create({
      userId: newUser._id,
      code,
      expiresAt,
    });

    await sendEmail(
      email,
      "Email Verification",
      `Your verification code is ${code}. It expires in 10 minutes`
    );
    sendSuccessResponse(res, "User Created successful");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.body;

    const tokenRecord = await userTokenModel.findOne({
      code,
    });

    if (!tokenRecord) {
      sendErrorResponse(res, 400, "Invalid Code");
      return;
    }

    const currentTime = new Date();
    if (currentTime > tokenRecord.expiresAt) {
      sendErrorResponse(res, 400, "Code Expired");

      return;
    }

    await userModel.findByIdAndUpdate(tokenRecord.userId, {
      emailVerified: true,
    });

    await userTokenModel.deleteMany({
      userId: tokenRecord.userId,
    });

    sendSuccessResponse(res, "Email verified successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = (await userModel.findOne({
      email,
    })) as User;

    if (!user) {
      sendErrorResponse(res, 400, "Invalid Credentials");
      return;
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      sendErrorResponse(res, 400, "Invalid Credentials");

      return;
    }

    const accessToken = generateToken(user._id, user.email, user.role);

    sendSuccessResponse(
      res,
      "Login successful",
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      accessToken
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = (await userModel.findOne({
      email,
    })) as User;

    if (!user) {
      sendErrorResponse(res, 400, "User not found");
      return;
    }

    const { code, expiresAt } = generateCode();

    await new userTokenModel({
      userId: user._id,
      code,
      expiresAt,
    }).save();

    await sendEmail(
      email,
      "Reset Password",
      `Your reset password token is ${code}. It expires in 10 minutes`
    );
    sendSuccessResponse(res, "Reset password token sent successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, newPassword } = req.body;

    const userToken = await userTokenModel.findOne({
      code,
    });

    const currentTime = new Date();
    if (
      !userToken ||
      !userToken.expiresAt ||
      currentTime > userToken.expiresAt
    ) {
      sendErrorResponse(res, 400, "Invalid or expired token");
      return;
    }

    const user = (await userModel.findOne({
      _id: userToken.userId,
    })) as User;

    const hashedPassword = await hashPassword(newPassword);

    await userModel.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword }
    );

    await userTokenModel.deleteMany({
      userId: user._id,
    });

    sendSuccessResponse(res, "Password reset successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const resendToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = (await userModel.findOne({
      email,
    })) as User;

    if (!user) {
      sendErrorResponse(res, 400, "User not found");
      return;
    }

    const { code, expiresAt } = generateCode();

    await userTokenModel.deleteMany({
      userId: user._id,
    });

    await userTokenModel.create({
      userId: user._id,
      code,
      expiresAt,
    });

    await sendEmail(
      email,
      "Email Verification",
      `Your verification code is ${code}. It expires in 10 minutes`
    );

    sendSuccessResponse(res, "Verification code sent successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logoutUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendErrorResponse(res, 400, "User not authenticated");
      return;
    }
    await userTokenModel.deleteMany({
      userId: req.user.userId,
    });

    sendSuccessResponse(res, "Logged out successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendErrorResponse(res, 400, "User not authenticated");
      return;
    }
    await userModel.findByIdAndDelete(req.user.userId);

    sendSuccessResponse(res, "Account deleted successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
