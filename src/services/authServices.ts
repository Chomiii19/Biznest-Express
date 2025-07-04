import { Response } from "express";
import signToken from "../utils/signToken";
import { IUser } from "../@types/interfaces";

class AuthServices {
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  createSendToken(id: string, statusCode: number, res: Response) {
    const token = signToken({ id });
    res.status(statusCode).json({ status: "Success", token });
  }

  async generateVerificationCode(user: IUser): Promise<void> {
    user.verificationCode = {
      code: this.generateCode(),
      expiresAt: new Date(Date.now() + 60 * 1000),
    };
    await user.save();
  }
}

export default new AuthServices();
