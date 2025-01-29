import { Request } from "express";
import { Document } from "mongoose";

export interface User extends Document {
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
  exp?: number;
}
