import mongoose, { model, Types, Schema, Document } from "mongoose";

interface IComment extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  replies: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
}

const commentSchema = new Schema<IComment>(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const commentModel = model<IComment>("comment", commentSchema);

export default commentModel;
