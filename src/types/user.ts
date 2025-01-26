import { Request } from "express";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  phoneNumber: string;
  profilePicture: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}
