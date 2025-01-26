import express from "express";
import authenticatedUser from "../middleware/authenticatedUser";
import rolesAllowed from "../middleware/rolesAllowed";

const adminRoutes = express.Router();
adminRoutes.use(authenticatedUser);
adminRoutes.use(rolesAllowed("admin"));

export default adminRoutes;
