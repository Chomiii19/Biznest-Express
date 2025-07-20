import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import UserServices from "../services/user.service";
import AppError from "../utils/appError";
import { IUpdateData } from "../@types/interfaces";

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
      return next(new AppError("User ID is missing", 400));
    }

    const user = await UserServices.findUserById(userId as string);

    if (!user || user?.blocked.some((id) => id === req.user._id)) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ status: "Success", data: { user } });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, firstname, surname, email } = req.body;
    const { userId } = req.params;
    const updateData: IUpdateData = {};

    if (username) updateData.username = username;
    if (firstname) updateData.firstname = firstname;
    if (surname) updateData.surname = surname;
    if (email) updateData.email = email;

    const updatedUser = await UserServices.updateUserById(userId, updateData);
    if (!updatedUser) return next(new AppError("Failed to Update User", 400));

    res.status(200).json({ status: "Success", data: { updatedUser } });
  },
);

const toggleUserBlocklist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blocked = req.params.userId;

    if (!blocked) {
      return next(new AppError("User ID is missing", 400));
    }

    await UserServices.toggleUserBlocklist(req.user._id, blocked);

    res.status(200).json({ status: "Success" });
  },
);

export { getUser, updateUser, toggleUserBlocklist };
