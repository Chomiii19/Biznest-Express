import mongoose, { Schema } from "mongoose";
import { IBookmark } from "../@types/interfaces";

const bookmarkSchema = new mongoose.Schema<IBookmark>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  coords: {
    lat: {
      type: Number,
      require: true,
    },
    lng: {
      type: Number,
      require: true,
    },
  },
  notes: String,
});

const Bookmark = mongoose.model<IBookmark>("bookmark", bookmarkSchema);

export default Bookmark;
