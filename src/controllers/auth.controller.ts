import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { OAuth2Client } from "google-auth-library";
import UserServices from "../services/user.service";
import AuthServices from "../services/auth.service";
import sendResetPasswordCode from "../utils/sendResetPasswordCode";

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

const facebookAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, surname, username, email, password } = req.body;

    if (!firstname || !surname || !username || !email || !password)
      return next(new AppError("Invalid empty fields", 400));

    const newUser = await UserServices.createUser({
      firstname,
      surname,
      username,
      email,
      password,
    });

    AuthServices.createSendToken(newUser._id, 201, res);
  },
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError("Invalid empty fields", 400));

    const user = await UserServices.findUserByEmail(email);

    if (!user || !(await user.comparePassword(password)))
      return next(new AppError("Invalid user credentials", 400));

    AuthServices.createSendToken(user._id, 200, res);
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError("No Email or password provided found", 404));

    const user = await UserServices.findUserByEmail(email);

    if (!user)
      return next(new AppError("User belonging to this email not found", 404));

    await UserServices.resetUserPassword(user, password);

    res.status(200).json({ status: "Success" });
  },
);

const requestResetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) return next(new AppError("No email provided found", 404));

    const user = await UserServices.findUserByEmail(email);

    if (!user)
      return next(new AppError("User belonging to this email not found", 404));

    await AuthServices.generateVerificationCode(user);
    await sendResetPasswordCode(user);

    res.status(200).json({ status: "Success", email: user.email });
  },
);

const checkOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) return next(new AppError("No Email or OTP found", 404));

    const user = await UserServices.findUserByEmail(email);

    if (!user)
      return next(new AppError("User belonging to this email not found", 404));

    if (user.verificationCode.expiresAt < new Date())
      return next(
        new AppError("Verification code has expired. Resend a new one", 400),
      );

    if (otp !== user.verificationCode.code)
      return next(new AppError("Incorrect OTP code", 400));

    res.status(200).json({ status: "Success", email: user.email });
  },
);

export {
  googleAuth,
  facebookAuth,
  signup,
  login,
  requestResetPassword,
  resetPassword,
  checkOTP,
};
