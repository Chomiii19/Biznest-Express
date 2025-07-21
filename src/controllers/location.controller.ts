import { NextFunction, Request, Response } from "express";
import LocationServices from "../services/location.service";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const getAllBookmarks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookmarks = await LocationServices.findAllUseBookmarks(req.user._id);

    res.status(200).json({
      stats: "Success",
      bookmarks,
    });
  },
);

const createBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coords, notes } = req.body;

    if (!coords.lat && !coords.lng)
      return next(new AppError("Invalid empty coordinates", 400));

    await LocationServices.createBookmark(req.user._id, coords, notes);

    res.status(201).json({ status: "Success" });
  },
);

const updateBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookmarkId } = req.params;
    const { coords, notes } = req.body;

    if (!bookmarkId)
      return next(new AppError("Invalid empty bookmark id", 404));

    if (!coords.lat && !coords.lng)
      return next(new AppError("Invalid empty coordinates", 400));

    await LocationServices.updateBookmarkById(
      bookmarkId,
      coords,
      notes,
      req.user._id,
    );

    res.status(200).json({ status: "Success" });
  },
);

const deleteBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookmarkId } = req.params;

    if (!bookmarkId)
      return next(new AppError("Invalid empty bookmark id", 404));

    await LocationServices.deleteBookmarkById(bookmarkId, req.user._id);

    res.status(200).json({ status: "Success" });
  },
);

const nearbyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const summary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export {
  getAllBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  nearbyPosts,
  summary,
};
