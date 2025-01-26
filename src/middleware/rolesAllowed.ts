import { Response, NextFunction } from "express";
import { sendErrorResponse } from "../utils/responses";
import { AuthenticatedRequest } from "../types/user";

const rolesAllowed = (role: "admin" | "user") => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log("user", user);
    if (req.user && req.user.role === role) {
      next();
    } else {
      sendErrorResponse(
        res,
        403,
        "You are not authorized to access this route"
      );
    }
  };
};

export default rolesAllowed;
