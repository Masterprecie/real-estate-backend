import { NextFunction, Response } from "express";
import commentModel from "../models/commentModel";
import { AuthenticatedRequest } from "../types/user";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import mongoose from "mongoose";

export const commentOnProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendErrorResponse(res, 400, "User not authenticated");
      return;
    }
    const { propertyId, content } = req.body;
    const userId = req.user.userId;

    const comment = new commentModel({
      propertyId,
      userId: new mongoose.Types.ObjectId(userId),
      content,
    });

    await comment.save();

    sendSuccessResponse(res, "Comment added successfully", comment);
  } catch (error) {
    next(error);
  }
};

export const replyToComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      sendErrorResponse(res, 400, "User not authenticated");
      return;
    }
    const { commentId, content } = req.body;
    const userId = req.user.userId;

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      sendErrorResponse(res, 404, "Comment not found");
      return;
    }

    comment.replies.push({
      userId: new mongoose.Types.ObjectId(userId),
      content,
      createdAt: new Date(),
    });

    await comment.save();

    sendSuccessResponse(res, "Reply added successfully", comment);
  } catch (error) {
    next(error);
  }
};
