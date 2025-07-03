import { Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}
