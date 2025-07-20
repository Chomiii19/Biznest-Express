import { NextFunction, Response, Request } from "express";
import catchAsync from "../utils/catchAsync";
import MessageServices from "../services/message.service";

const getAllConversations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export { getAllConversations, getConversation, updateMessage, deleteMessage };
