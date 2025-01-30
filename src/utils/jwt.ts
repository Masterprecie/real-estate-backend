import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/user";

export const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const secretKey = process.env.JWT_SECRET as string;
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    if ((err as Error).name === "TokenExpiredError") {
      throw new Error("TokenExpiredError");
    }
    throw new Error("Unauthorized");
  }
};

export const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_REFRESH_SECRET_KEY as string,
    { expiresIn: "30d" }
  );
};

export const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY as string);
};
