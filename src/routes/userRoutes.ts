import express from "express";
import { getUsers, getUserById, editUser } from "../controllers/userController";
import authenticatedUser from "../middleware/authenticatedUser";
import rolesAllowed from "../middleware/rolesAllowed";

const userRoutes = express.Router();

userRoutes.get("/", authenticatedUser, rolesAllowed("admin"), getUsers);
userRoutes.get("/:id", authenticatedUser, rolesAllowed("admin"), getUserById);
userRoutes.put("/:id", authenticatedUser, rolesAllowed("admin"), editUser);

export default userRoutes;
