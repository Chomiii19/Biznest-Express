import mongoose, { Schema } from "mongoose";
import { IConversation } from "../@types/interfaces";

const conversationSchema = new mongoose.Schema<IConversation>({
  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      isHidden: {
        type: Boolean,
        default: false,
      },
      isMuted: {
        type: Boolean,
        default: false,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      unreadCount: {
        type: Number,
        default: 0,
      },
    },
  ],
  latestMessage: {
    type: String,
    default: "",
  },
  latestMessageDate: {
    type: Date,
    default: Date.now,
  },
});

conversationSchema.index({ "users.user": 1 });

const Conversation = mongoose.model<IConversation>(
  "conversation",
  conversationSchema,
);

export default Conversation;
