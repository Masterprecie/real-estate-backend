import express from "express";
import {
  deleteProperty,
  getProperties,
  getSingleProperty,
  postProperty,
  updateProperty,
} from "../controllers/propertyController";
import authenticatedUser from "../middleware/authenticatedUser";
import rolesAllowed from "../middleware/rolesAllowed";
const propertyRoutes = express.Router();

propertyRoutes.get("/", getProperties);

propertyRoutes.get("/:id", getSingleProperty);

propertyRoutes.post(
  "/",
  authenticatedUser,
  rolesAllowed("admin"),
  postProperty
);

propertyRoutes.put(
  "/:id",
  authenticatedUser,
  rolesAllowed("admin"),
  updateProperty
);

propertyRoutes.delete(
  "/",
  authenticatedUser,
  rolesAllowed("admin"),
  deleteProperty
);

export default propertyRoutes;
