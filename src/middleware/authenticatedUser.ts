import { Response, NextFunction } from "express";
import userModel from "../models/userModel";
import { verifyToken } from "../utils/jwt";
import { AuthenticatedRequest, JwtPayload } from "../types/user";
import { sendErrorResponse } from "../utils/responses";

const authenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      sendErrorResponse(res, 401, "Access token is missing or invalid");
      return;
    }

    const decoded = verifyToken(token) as JwtPayload;
    const user = (await userModel.findById(decoded.userId)) as { _id: string };

    if (!user) {
      sendErrorResponse(res, 400, "User not found");
      return;
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export default authenticatedUser;
