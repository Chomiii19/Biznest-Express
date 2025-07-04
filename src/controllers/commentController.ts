import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import CommentServices from "../services/commentServices";

const getComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const createReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export {
  getComment,
  updateComment,
  deleteComment,
  getReplies,
  createReply,
  updateReply,
  deleteReply,
};
