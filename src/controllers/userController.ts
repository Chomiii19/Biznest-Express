import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import UserServices from "../services/userServices";
import AppError from "../utils/appError";
import { Types } from "mongoose";

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;

    if (!userId) {
      return next(new AppError("User ID is missing", 400));
    }

    const user = await UserServices.findUserById(userId as string);

    if (!user || user.blocked.includes(req.user._id)) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ status: "Success", data: { user } });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const blockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export { getUser, updateUser, blockUser };
