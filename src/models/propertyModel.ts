import mongoose, { Schema, Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  priceDuration: string;
  location: string;
  status: "rent" | "sale";
  category: string;
  bedrooms: number;
  facilities: string[];
  images: string[];
}

interface PaginatePropertyModel<T extends Document> extends mongoose.Model<T> {
  paginate(
    query?: object,
    options?: mongoose.PaginateOptions
  ): Promise<mongoose.PaginateResult<T>>;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    priceDuration: { type: String },
    location: { type: String },
    status: { type: String, enum: ["rent", "sale"] },
    category: {
      type: String,
      enum: [
        "house",
        "condos",
        "duplexes",
        "studios",
        "apartments",
        "villas",
        "offices",
        "shops",
        "warehouses",
        "others",
      ],
    },
    bedrooms: { type: Number },
    facilities: { type: [String] },
    images: { type: [String] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true },
  }
);

propertySchema.plugin(paginate);

propertySchema.virtual("ratings", {
  ref: "rating",
  localField: "_id",
  foreignField: "propertyId",
  justOne: false,
});

propertySchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "propertyId",
  justOne: false,
});

const propertyModel = mongoose.model<
  IProperty,
  PaginatePropertyModel<IProperty>
>("property", propertySchema);

export default propertyModel;
