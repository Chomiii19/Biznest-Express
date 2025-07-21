import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import CommentServices from "../services/comment.service";
import ReplyServices from "../services/reply.service";

const getAllComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    if (!postId) return next(new AppError("Invalid empty postId", 400));

    const data = await CommentServices.findAllCommentsByPostId(
      postId,
      req.user,
      req.query,
    );

    res.status(200).json({ status: "Success", data });
  },
);

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { text } = req.body;

    if (!postId) return next(new AppError("Invalid empty postId", 400));

    if (!text) return next(new AppError("Invalid empty comment", 400));

    const data = await CommentServices.createComment(
      postId,
      req.user._id,
      text,
    );

    res.status(200).json({ status: "Success", data });
  },
);

const getComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    if (!commentId) {
      return next(new AppError("Comment ID is missing", 400));
    }

    const comment = CommentServices.findCommentById(commentId, req.user);

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
    const { text } = req.body;

    if (!text) {
      return next(new AppError("new text or Vote action is missing", 400));
    }

    const updatedComment = await CommentServices.updateCommentTextById(
      commentId,
      text,
    );

    if (!updatedComment) {
      return next(new AppError("Failed to update comment", 400));
    }

    res.status(200).json({ status: "Success", data: { updatedComment } });
  },
);

const toggleUpvote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    await CommentServices.toggleCommentUpvoteById(req.user._id, commentId);

    res.status(200).json({ status: "Success" });
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
      req.user,
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
  toggleUpvote,
};
