import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  blocked: Schema.Types.ObjectId[];
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

export interface IComments extends Document {
  post: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  text: string;
  upvote_count: number;
  replies?: IReplies[];
}

export interface IReplies {
  author: Schema.Types.ObjectId;
  createdAt: Date;
  text: string;
  upvote_count: number;
}

export interface IConversation extends Document {
  users: {
    user: Schema.Types.ObjectId;
    isHidden: boolean;
    isMuted: boolean;
    isRead: boolean;
    unreadCount: number;
  }[];
  latestMessage: string;
  latestMessageDate: Date;
}

export interface IMessage extends Document {
  conversation: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  content: {
    type: "text" | "image";
    text: string;
  };
  image: string;
  isDeleted: boolean;
  isRead: Schema.Types.ObjectId[];
  createdAt: Date;
}
