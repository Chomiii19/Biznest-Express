import { Request } from "express";
import { IUser, IUpdateData } from "../@types/interfaces";
import User from "../models/user.model";

interface NewUserInput {
  firstname: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

class UserServices {
  async createUser(user: NewUserInput): Promise<IUser> {
    const newUser = await User.create({
      firstname: user.firstname,
      surname: user.surname,
      username: user.username,
      email: user.email,
      password: user.password,
    });

    return newUser;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).select("+password");
    return user;
  }

  async findUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

  async resetUserPassword(user: IUser, password: string): Promise<void> {
    user.password = password;
    await user.save();
  }

  async updateUserById(
    id: string,
    updateData: IUpdateData,
  ): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return updatedUser;
  }

  async toggleUserBlocklist(id: string, blocked: string): Promise<void> {
    const user = await User.findById(id);

    if (user?.blocked.some((id) => id.toString() === blocked)) {
      await User.findByIdAndUpdate(id, { $pull: { blocked } });
    } else {
      await User.findByIdAndUpdate(id, { $addToSet: { blocked } });
    }
  }
}

export default new UserServices();
