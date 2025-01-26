import express from "express";
import authenticatedUser from "../middleware/authenticatedUser";
import rolesAllowed from "../middleware/rolesAllowed";
import {
  getPropertyRating,
  rateProperty,
} from "../controllers/propertyRatingController";

const propertyRatingRoutes = express.Router();

propertyRatingRoutes.get("/rating", getPropertyRating);

propertyRatingRoutes.post("/rate", authenticatedUser, rateProperty);

export default propertyRatingRoutes;
