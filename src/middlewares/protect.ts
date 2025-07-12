import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import verifyToken from "../utils/verifyToken";
import UserServices from "../services/user.service";

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next(new AppError("No token found", 404));
    const decodedToken = verifyToken(token) as { id: string };
    const user = await UserServices.findUserById(decodedToken.id);

    if (!user)
      return next(
        new AppError("User belonging to this token does not exist", 404),
      );

    req.user = user;
    next();
  },
);

export default protect;
