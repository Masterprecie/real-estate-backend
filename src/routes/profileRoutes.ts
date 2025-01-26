import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import authenticatedUser from "../middleware/authenticatedUser";

const profileRoutes = express.Router();
profileRoutes.use(authenticatedUser);

profileRoutes.get("/profile", getProfile);

profileRoutes.put("/profile", updateProfile);

export default profileRoutes;
