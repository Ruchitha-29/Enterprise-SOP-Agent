import mongoose from 'mongoose';

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
      required: true,
      min: 1,
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
      index: false, // Atlas Vector Search index will be managed on the collection
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

documentChunkSchema.index({ documentName: 1, pageNumber: 1, chunkIndex: 1 }, { unique: true });

export const DocumentChunk =
  mongoose.models.DocumentChunk || mongoose.model('DocumentChunk', documentChunkSchema);

