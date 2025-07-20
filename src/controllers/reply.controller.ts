import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import ReplyServices from "../services/reply.service";

const updateReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { replyId } = req.params;
    const { text, upvote } = req.body;

    if (!text && !upvote) {
      return next(new AppError("new text or Vote action is missing", 400));
    }

    if (text) {
      const updatedReply = await ReplyServices.updateReplyTextById(
        replyId,
        text,
      );

      if (!updatedReply) {
        return next(new AppError("Reply not found", 400));
      }

      res.status(200).json({ status: "Success", data: { updatedReply } });
    }

    if (upvote) {
      await ReplyServices.toggleReplyUpvoteById(req.user._id, replyId);

      res.status(200).json({ status: "Success" });
    }
  },
);

const deleteReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { replyId } = req.params;

    if (!replyId) {
      return next(new AppError("replyId is missing", 400));
    }

    const deletedReply = await ReplyServices.deleteReplyById(replyId);

    if (!deletedReply) {
      return next(new AppError("Reply not found ", 404));
    }

    res.status(200).json({ status: "Success" });
  },
);

export { updateReply, deleteReply };
