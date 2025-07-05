import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import CommentServices from "../services/commentServices";

const getComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    if (!commentId) {
      return next(new AppError("Comment ID is missing", 400));
    }

    const comment = CommentServices.findCommentById(commentId);

    if (!comment) {
      return next(
        new AppError("Comment does not exist or has been deleted", 404),
      );
    }

    res.status(200).json({ status: "Success", data: { comment } });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { text, upvote } = req.body;

    if (!text && !upvote) {
      return next(new AppError("new text or Vote action is missing", 400));
    }

    if (text) {
      const updatedComment = await CommentServices.updateCommentTextById(
        commentId,
        text,
      );

      if (!updatedComment) {
        return next(new AppError("Failed to update comment", 400));
      }

      res.status(200).json({ status: "Success", data: { updatedComment } });
    }

    if (upvote) {
      await CommentServices.toggleCommentUpvoteById(req.user._id, commentId);

      res.status(200).json({ status: "Success" });
    }
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    if (!commentId) {
      return next(new AppError("Comment ID is missing", 400));
    }

    const deletedComment = CommentServices.deleteCommentById(commentId);

    if (!deletedComment) {
      return next(new AppError("Comment not found", 404));
    }

    res.status(200).json({ status: "Success" });
  },
);

export { getComment, updateComment, deleteComment };
