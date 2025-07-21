import { NextFunction, Request, Response } from "express";
import LocationServices from "../services/location.service";
import catchAsync from "../utils/catchAsync";

const getAllBookmarks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const createBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
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
