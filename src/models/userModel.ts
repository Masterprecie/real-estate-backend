import mongoose, { Document, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  googleId: string;
  password: string;
  role: "user" | "admin";
  phoneNumber: string;
  emailVerified: boolean;
  profilePicture: string;
}

interface PaginateUserModel<T extends Document> extends mongoose.Model<T> {
  paginate(
    query?: object,
    options?: mongoose.PaginateOptions
  ): Promise<mongoose.PaginateResult<T>>;
}

const userSchema = new Schema<IUser>(
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

const userModel = mongoose.model<IUser, PaginateUserModel<IUser>>(
  "user",
  userSchema
);
export default userModel;
