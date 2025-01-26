import mongoose, { InferSchemaType, model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phoneNumber: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.plugin(paginate);

type UserType = InferSchemaType<typeof userSchema>;

export interface UserDocument extends mongoose.Document, UserType {}

const userModel = model<UserDocument, mongoose.PaginateModel<UserDocument>>(
  "user",
  userSchema
);

export default userModel;
