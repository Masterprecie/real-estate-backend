import mongoose, { Types, model, Schema } from "mongoose";

const userTokenSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "user",
  },
  refreshToken: {
    type: String,
  },
  code: {
    type: String,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const userTokenModel = model("userToken", userTokenSchema);

export default userTokenModel;
