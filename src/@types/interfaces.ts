import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface IPost extends Document {
  author: Schema.Types.ObjectId;
  description: string;
  images_url: string[];
  comment_count: number;
  heart_count: number;
  hasBookmarked: boolean;
  hasHearted: boolean;
  createdAt: Date;
  price: number | null;
  size: number;
  address: string;
}
