import { NextFunction, Response } from "express";
import userModel from "../models/userModel";
import { AuthenticatedRequest, User } from "../types/user";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, phoneNumber, profilePicture } = req.body;
    if (!req.user) {
      sendErrorResponse(res, 400, "User not authenticated");
      return;
    }
    const user = (await userModel.findOneAndUpdate(
      { _id: req.user.userId },
      { firstName, lastName, phoneNumber, profilePicture },
      { new: true }
    )) as User;

    if (!user) {
      sendErrorResponse(res, 400, "User not found");
      return;
    }

    sendSuccessResponse(res, "Profile updated successfully", {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendErrorResponse(res, 400, "User not authenticated");
      return;
    }

    const user = (await userModel.findOne({
      _id: req.user.userId,
    })) as User;

    if (!user) {
      sendErrorResponse(res, 400, "User not found");
      return;
    }

    sendSuccessResponse(res, "User fetched successfully", {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
