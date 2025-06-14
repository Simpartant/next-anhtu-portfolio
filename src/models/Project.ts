import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: String,
    description: String,
    category: String,
    type: String,
    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
