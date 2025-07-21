import { PipelineStage, Types } from "mongoose";
import { IComments, IUser } from "../@types/interfaces";
import Comment from "../models/comment.model";

class CommentServices {
  async findAllCommentsByPostId(
    postId: string,
    currentUser: IUser,
    query: any,
  ): Promise<{ comments: IComments[]; page: number; hasMore: boolean }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sort || "-createdAt";
    const filters: any = { postId, isDeleted: false };

    const basePipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $match: {
          ...filters,
          "author._id": { $nin: currentUser.blocked },
          "author.blocked": { $ne: currentUser._id },
        },
      },
      {
        $sort: {
          createdAt: sortBy.startsWith("-") ? -1 : 1,
        },
      },
    ];

    const comments = await Comment.aggregate([
      ...basePipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const nextPage = await Comment.aggregate([
      ...basePipeline,
      { $skip: skip + limit },
      { $limit: 1 },
    ]);

    return {
      comments,
      page,
      hasMore: nextPage.length > 0,
    };
  }

  async createComment(
    postId: string,
    author: Types.ObjectId,
    text: string,
  ): Promise<IComments> {
    const comment = await Comment.create({
      post: postId,
      author,
      text,
    });

    return comment;
  }

  async findCommentById(
    id: string,
    currentUser: IUser,
  ): Promise<IComments | null> {
    const comment = await Comment.findById(id).populate("author");

    if (!comment || !comment.author || !(comment.author as IUser).blocked) {
      return null;
    }

    const author = comment.author as IUser;

    if (
      !author.blocked.includes(currentUser._id) &&
      !currentUser.blocked.includes(author._id)
    )
      return comment;

    return null;
  }

  async updateCommentTextById(
    _id: string,
    text: string,
    currentUser: IUser,
  ): Promise<IComments | null> {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id, author: currentUser._id },
      { text },
      { new: true },
    );

    return updatedComment;
  }

  async toggleCommentUpvoteById(
    id: Types.ObjectId,
    commentId: string,
  ): Promise<void> {
    const comment = await Comment.findById(commentId);

    if (comment?.upvoted_users.some((uid) => uid === id)) {
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { upvoted_users: id },
      });
    } else {
      await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { upvoted_users: id },
      });
    }
  }

  async deleteCommentById(id: string): Promise<IComments | null> {
    const comment = Comment.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    return comment;
  }
}

export default new CommentServices();
