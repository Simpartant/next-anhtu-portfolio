import mongoose, { Schema } from "mongoose";

export enum ProjectType {
  onSale = "Đang mở bán",
  booking = "Booking",
  onProgress = "Đang bàn giao",
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    area: { type: String, required: true, index: true },
    investor: { type: String, required: true, index: true },
    type: { type: String, required: true, index: true },
    apartmentType: { type: String, required: true, index: true },
    defaultImage: String,
    listImages: [String],
    detail: String,
    acreage: String,
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
