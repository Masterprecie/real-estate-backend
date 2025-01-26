import express from "express";
import authenticatedUser from "../middleware/authenticatedUser";
import rolesAllowed from "../middleware/rolesAllowed";
import {
  commentOnProperty,
  replyToComment,
} from "../controllers/commentController";

const commentRoutes = express.Router();

commentRoutes.post(
  "/comment",
  authenticatedUser,
  rolesAllowed("user"),
  commentOnProperty
);
commentRoutes.post(
  "/comment/reply",
  authenticatedUser,
  rolesAllowed("admin"),
  replyToComment
);

export default commentRoutes;
