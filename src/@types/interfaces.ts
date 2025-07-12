import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  firstname: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  blocked: Schema.Types.ObjectId[];
  verificationCode: {
    code: string;
    expiresAt: Date;
  };
  comparePassword(password: string): Promise<boolean>;
}

export interface IPost extends Document {
  _id: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId | IUser;
  description: string;
  images_url: string[];
  comment_count: number;
  heart_count: number;
  hasBookmarked: Schema.Types.ObjectId[];
  hasHearted: Schema.Types.ObjectId[];
  createdAt: Date;
  price: number | null;
  size: number;
  address: string;
  proof: string;
  status: "approved" | "pending" | "deleted";
}

export interface IComments extends Document {
  post: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  text: string;
  isDeleted: boolean;
  upvoted_users: Schema.Types.ObjectId[];
}

export interface IReplies extends Document {
  commentId: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  text: string;
  isDeleted: boolean;
  upvoted_users: Schema.Types.ObjectId[];
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

export interface IUpdateData {
  username?: string;
  firstname?: string;
  surname?: string;
  email?: string;
  blocked?: string;
}

export interface MulterFields {
  postImages?: Express.Multer.File[];
  proof?: Express.Multer.File[];
}
