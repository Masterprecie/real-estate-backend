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

    let decoded: JwtPayload;

    try {
      decoded = verifyToken(token) as JwtPayload;
    } catch (err) {
      if (err instanceof Error && err.message === "TokenExpiredError") {
        sendErrorResponse(res, 401, "Access token has expired");
        return;
      }
      sendErrorResponse(res, 401, "Unauthorized");
      return;
    }

    const user = await userModel.findById(decoded.userId);

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
