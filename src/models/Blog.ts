import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: String,
    content: String,
    image: String,
    description: String,
    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
