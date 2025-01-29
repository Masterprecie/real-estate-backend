import express from "express";
import {
  forgetPassword,
  loginUser,
  refreshToken,
  registerUser,
  resendToken,
  resetPassword,
  verifyEmail,
} from "../controllers/authController";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);

authRoutes.post("/verify-email", verifyEmail);

authRoutes.post("/login", loginUser);

authRoutes.post("/refresh-token", refreshToken);

authRoutes.post("/forget-password", forgetPassword);

authRoutes.post("/reset-password", resetPassword);

authRoutes.post("/resend-token", resendToken);

export default authRoutes;
