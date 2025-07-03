import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "conversation",
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  latestMessage: String,
  latestMessageDate: Date,
  isRead: {
    type: Boolean,
    default: false,
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
});

const Message = mongoose.model("message", messageSchema);

export default Message;
