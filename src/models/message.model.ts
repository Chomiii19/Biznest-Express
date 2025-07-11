import mongoose, { Schema } from "mongoose";
import { IMessage } from "../@types/interfaces";

const messageSchema = new mongoose.Schema<IMessage>({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "conversation",
  },
  user: { type: Schema.Types.ObjectId, ref: "user" },
  content: {
    type: String,
    enum: ["text", "image"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isRead: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.index({ conversation: 1 });
messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ user: 1 });

const Message = mongoose.model<IMessage>("message", messageSchema);

export default Message;
