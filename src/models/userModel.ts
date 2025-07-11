import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { IUser } from "../@types/interfaces";
import { NextFunction } from "express";

const userSchema = new mongoose.Schema<IUser>({
  firstname: {
    type: String,
    required: [true, "Firstname field is required"],
  },
  surname: {
    type: String,
    required: [true, "Surname field is required"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username field is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email field is required"],
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: [true, "Password field is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    code: String,
    expiresAt: Date,
  },
  blocked: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

// @ts-expect-error
userSchema.pre("save", async function (this: IUser, next: NextFunction) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("user", userSchema);

export default User;
