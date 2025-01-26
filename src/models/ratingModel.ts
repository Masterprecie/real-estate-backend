import mongoose, { Schema, Document } from "mongoose";

interface IRating extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
}

const ratingSchema = new Schema<IRating>(
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
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
  },
  { timestamps: true }
);

const ratingModel = mongoose.model<IRating>("rating", ratingSchema);

export default ratingModel;
