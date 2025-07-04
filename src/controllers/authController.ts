import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { OAuth2Client } from "google-auth-library";

const googleAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;

    if (!idToken) return next(new AppError("No auth token received", 404));

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) return next(new AppError("Invalid or expired token", 400));

    const payload = ticket.getPayload();
    if (!payload) return next(new AppError("Token verification failed", 400));

    console.log(payload);

    res.status(200).json({ status: "Success", user: payload });
  },
);

export { googleAuth };
