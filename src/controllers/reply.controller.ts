import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import ReplyServices from "../services/reply.service";

const getReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    if (!commentId) {
      return next(new AppError("Comment ID is missing", 400));
    }

    const comment = await ReplyServices.getRepliesByCommentId(
      commentId,
      req.query,
    );

    if (!comment) {
      return next(
        new AppError("Comment does not exist or has been deleted", 404),
      );
    }

    res.status(200).json({ status: "Success", data: { comment } });
  },
);

const createReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { text } = req.body;

    const reply = await ReplyServices.createReply(
      commentId,
      text,
      req.user._id,
    );

    if (!reply) {
      return next(new AppError("Failed to post reply", 400));
    }

    res.status(201).json({ status: "Success", data: { reply } });
  },
);

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

export { getReplies, createReply, updateReply, deleteReply };
