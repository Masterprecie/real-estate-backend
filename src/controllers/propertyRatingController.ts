import { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import ratingModel from "../models/ratingModel";
import { AuthenticatedRequest } from "../types/user";

export const rateProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendErrorResponse(res, 400, "User not authenticated");
      return;
    }
    const { propertyId, rating } = req.body;
    const userId = req.user.userId;

    const existingRating = await ratingModel.findOne({ propertyId, userId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      const newRating = new ratingModel({
        propertyId,
        userId,
        rating,
      });

      await newRating.save();
    }

    sendSuccessResponse(res, "Property rated successfully");
  } catch (error) {
    next(error);
  }
};

export const getPropertyRating = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.params);
    const { propertyId } = req.params;

    const ratings = await ratingModel.find({ propertyId });

    if (ratings.length === 0) {
      sendErrorResponse(res, 404, "No ratings found for this property");
      return;
    }

    const totalRatings = ratings.length;
    const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const averageRating = totalRating / totalRatings;

    sendSuccessResponse(res, "Ratings retrieved successfully", {
      totalRatings,
      averageRating,
    });
  } catch (error) {
    next(error);
  }
};
