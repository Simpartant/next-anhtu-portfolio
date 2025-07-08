import mongoose, { Schema, Document, models } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  project?: string;
  message?: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    project: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "contacts" }
);

export default models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
