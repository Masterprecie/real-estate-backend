import { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import userModel from "../models/userModel";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query: any = {
      role: { $ne: "admin" },
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: { createdAt: -1 },
      select: "-password -__v",
    };

    const users = await userModel.paginate(query, options);
    if (users.docs.length === 0) {
      sendErrorResponse(res, 404, "No users found");
      return;
    }
    sendSuccessResponse(res, "User fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password -__v");

    if (!user) {
      sendErrorResponse(res, 404, "User not found");
      return;
    }
    sendSuccessResponse(res, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      sendErrorResponse(res, 404, "User not found");
      return;
    }
    sendSuccessResponse(res, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};
