import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import errorHandler from "./middleware/errorMessages";
import profileRoutes from "./routes/profileRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import commentRoutes from "./routes/commentRoutes";
import propertyRatingRoutes from "./routes/propertyRatingRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", profileRoutes);
app.use("/api/v1/property", propertyRoutes);
app.use("/api/v1/property", commentRoutes);
app.use("/api/v1/property", propertyRatingRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Precious Real Estate App!");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

export default app;
