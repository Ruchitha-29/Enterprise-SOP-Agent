import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
});

const chatSessionSchema = new mongoose.Schema(
  {
    userId: String,
    companyId: String,
    title: String,
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const ChatSession =
  mongoose.models.ChatSession || mongoose.model("ChatSession", chatSessionSchema);

