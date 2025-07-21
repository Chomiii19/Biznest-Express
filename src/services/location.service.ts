import { Types } from "mongoose";
import Bookmark from "../models/bookmark.model";
import AppError from "../utils/appError";
import { IBookmark } from "../@types/interfaces";

class LocationServices {
  async findAllUseBookmarks(userId: Types.ObjectId): Promise<IBookmark[]> {
    return await Bookmark.find({ userId });
  }

  async createBookmark(
    userId: Types.ObjectId,
    coords: { lat: number; lng: number },
    notes: string,
  ): Promise<void> {
    const bookmark = await Bookmark.create({
      userId,
      coords,
      notes,
    });

    if (!bookmark) throw new AppError("Unable to save location", 400);
  }

  async findBookmarkById(bookmarkId: string): Promise<IBookmark> {
    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) throw new AppError("Bookmark not found", 404);

    return bookmark;
  }

  async updateBookmarkById(
    bookmarkId: string,
    coords: { lat: number; lng: number },
    notes: string,
    userId: Types.ObjectId,
  ): Promise<void> {
    const bookmark = await Bookmark.findOne({ _id: bookmarkId, userId });

    if (!bookmark)
      throw new AppError("Bookmark not found or unauthorized", 404);

    bookmark.coords = coords;
    bookmark.notes = notes;
    await bookmark.save();
  }

  async deleteBookmarkById(
    bookmarkId: string,
    userId: Types.ObjectId,
  ): Promise<void> {
    const deleted = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      userId,
    });

    if (!deleted) throw new AppError("Bookmark not found or unauthorized", 404);
  }
}

export default new LocationServices();
