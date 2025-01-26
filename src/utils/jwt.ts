import jwt from "jsonwebtoken";

export const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
