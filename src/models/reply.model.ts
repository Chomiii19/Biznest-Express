import mongoose, { Schema } from "mongoose";
import { IReplies } from "../@types/interfaces";

const replySchema = new mongoose.Schema<IReplies>({
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "comment",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  text: String,
  upvoted_users: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const Reply = mongoose.model<IReplies>("reply", replySchema);

export default Reply;
