import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import ReplyService from "../services/reply.service";

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

export {};
