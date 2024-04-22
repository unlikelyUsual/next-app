import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IDocuments extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadDate: Date;
}

const userSchema = new Schema<IDocuments>({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  filename: {
    type: String,
  },
  originalName: {
    type: String,
  },
  mimeType: {
    type: String,
  },
  size: {
    type: Number,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
});

const DocumentModel =
  models.documents || model<IDocuments>("documents", userSchema);

export default DocumentModel;
