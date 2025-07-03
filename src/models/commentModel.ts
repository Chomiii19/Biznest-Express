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
  upvote_count: {
    type: Number,
    default: 0,
  },
  replies: {
    type: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: String,
        upvote_count: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComments>("comment", commentSchema);

export default Comment;
