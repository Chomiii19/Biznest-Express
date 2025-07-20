import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import CommentServices from "../services/comment.service";
import ReplyServices from "../services/reply.service";

const getAllComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const data = await CommentServices.findAllCommentsByPostId(
      postId,
      req.user,
      req.query,
    );

    res.status(200).json({ status: "Success", data });
  },
);

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

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

export {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getReplies,
  createReply,
};
