import mongoose, { Schema } from "mongoose";
import { IPost } from "../@types/interfaces";

const postSchema = new mongoose.Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images_url: [String],
  comment_count: {
    type: Number,
    default: 0,
  },
  heart_count: {
    type: Number,
    default: 0,
  },
  hasBookmarked: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  hasHearted: {
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
  price: {
    type: Number,
    default: null,
  },
  size: {
    type: Number,
    default: 0,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  proof: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["approved", "pending", "deleted"],
    default: "pending",
  },
});

postSchema.index({ description: "text" });

const Post = mongoose.model<IPost>("post", postSchema);

export default Post;
