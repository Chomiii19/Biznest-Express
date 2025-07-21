import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstname: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  blocked: Types.ObjectId[];
  verificationCode: {
    code: string;
    expiresAt: Date;
  };
  comparePassword(password: string): Promise<boolean>;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId | IUser;
  description: string;
  images_url: string[];
  comment_count: number;
  heart_count: number;
  hasBookmarked: Types.ObjectId[];
  hasHearted: Types.ObjectId[];
  createdAt: Date;
  price: number | null;
  size: number;
  address: string;
  proof: string;
  status: "approved" | "pending" | "deleted" | "saved";
}

export interface IComments extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId | IUser;
  createdAt: Date;
  text: string;
  isDeleted: boolean;
  upvoted_users: Types.ObjectId[];
}

export interface IReplies extends Document {
  commentId: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  text: string;
  isDeleted: boolean;
  upvoted_users: Types.ObjectId[];
}

export interface IConversation extends Document {
  _id: Types.ObjectId;
  users: {
    user: Types.ObjectId;
    isHidden: boolean;
    isMuted: boolean;
    isRead: boolean;
    unreadCount: number;
  }[];
  latestMessage: string;
  latestMessageDate: Date;
}

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  user: Types.ObjectId;
  content: {
    type: "text" | "image";
    text: string;
  };
  isDeleted: boolean;
  isRead: Types.ObjectId[];
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

export interface IBookmark {
  userId: Types.ObjectId;
  coords: {
    lat: number;
    lng: number;
  };
  notes: string;
}
