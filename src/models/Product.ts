import mongoose, { Schema } from "mongoose";

export enum ProjectType {
  onSale = "Đang mở bán",
  booking = "Booking",
  onProgress = "Đang bàn giao",
}

const ProductSchema = new Schema(
  {
    name: String,
    area: String,
    investor: String,
    defaultImage: String,
    listImages: [String],
    detail: String,
    type: {
      type: String,
      enum: Object.values(ProjectType),
    },
    apartmentType: String,
    acreage: String,
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
