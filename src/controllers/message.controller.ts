import { NextFunction, Response, Request } from "express";
import catchAsync from "../utils/catchAsync";
import MessageServices from "../services/message.service";
import AppError from "../utils/appError";
import { activeUsers, getIO } from "../socket";

const getAllConversations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await MessageServices.findUserConversations(
      req.user,
      req.query,
    );

    res.status(200).json({ status: "Success", data });
  },
);

const sendMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { usersId, message } = req.body;
    const io = getIO();

    if (!message.content?.text?.trim())
      return next(new AppError("Invalid empty text", 400));

    const savedMessage = await MessageServices.createMessage(message, usersId);

    for (const userId of usersId) {
      const userSocket = activeUsers.find((u) => u.userId === userId);

      if (userSocket) {
        io.to(userSocket.socketId).emit("receive-message", {
          message: savedMessage,
          usersId,
        });
      }
    }

    res.status(200).json({ status: "Success" });
  },
);

const getConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;

    if (!conversationId)
      return next(new AppError("Invalid empty conversation id", 400));

    const data = await MessageServices.findAllConversationMessages(
      conversationId,
      req.user,
      req.query,
    );

    res.status(200).json({ staus: "Success", data });
  },
);

const updateMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { messageId } = req.params;
    const { text } = req.body;

    if (!messageId) return next(new AppError("Invalid empty message id", 400));

    await MessageServices.findMessageByIdAndUpdate(
      messageId,
      req.user._id,
      text,
    );

    return res.status(200).json({ status: "Success" });
  },
);

const deleteMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { messageId } = req.params;

    if (!messageId) return next(new AppError("Invalid empty message id", 400));

    await MessageServices.findByIdAndDelete(req.user._id, messageId);

    return res.status(200).json({ status: "Success" });
  },
);

export {
  getAllConversations,
  sendMessage,
  getConversation,
  updateMessage,
  deleteMessage,
};
