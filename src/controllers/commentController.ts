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
    }
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const createReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteReply = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export {
  getComment,
  updateComment,
  deleteComment,
  getReplies,
  createReply,
  updateReply,
  deleteReply,
};
