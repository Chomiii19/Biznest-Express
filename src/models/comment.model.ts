import mongoose, { Schema } from "mongoose";
import { IComments } from "../@types/interfaces";

const commentSchema = new mongoose.Schema<IComments>({
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
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

const Comment = mongoose.model<IComments>("comment", commentSchema);

export default Comment;
