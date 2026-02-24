import mongoose from "mongoose";

const { Schema } = mongoose;

const documentChunkSchema = new Schema(
  {
    documentName: {
      type: String,
      required: true,
      trim: true,
    },
    pageNumber: {
      type: Number,
      default: null,
    },
    chunkIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    content: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      default: [],
    },
    companyId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

documentChunkSchema.index(
  { documentName: 1, chunkIndex: 1 },
  { unique: true }
);

export const DocumentChunk =
  mongoose.models.DocumentChunk ||
  mongoose.model("DocumentChunk", documentChunkSchema);