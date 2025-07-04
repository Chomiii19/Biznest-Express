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
    type: Boolean,
    default: false,
  },
  hasHearted: {
    type: Boolean,
    default: false,
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
});

postSchema.index({ description: "text" });

const Post = mongoose.model<IPost>("post", postSchema);

export default Post;
