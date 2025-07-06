import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: String,
    content: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
