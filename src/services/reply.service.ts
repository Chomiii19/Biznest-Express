import { IReplies, IUser } from "../@types/interfaces";
import Reply from "../models/reply.model";
import { PipelineStage, Types } from "mongoose";

class ReplyServices {
  async getRepliesByCommentId(
    commentId: string,
    currentUser: IUser,
    query: any,
  ): Promise<{ replies: IReplies[]; page: number; hasMore: boolean }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sort || "-createdAt";
    const filters = { commentId, isDeleted: false };

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

    const replies = await Reply.aggregate([
      ...basePipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const nextPageReplies = await Reply.aggregate([
      ...basePipeline,
      { $skip: skip + limit },
      { $limit: 1 },
    ]);

    return {
      replies,
      page,
      hasMore: nextPageReplies.length > 0,
    };
  }

  async createReply(
    commentId: string,
    text: string,
    author: Types.ObjectId,
  ): Promise<IReplies | null> {
    const reply = await Reply.create({ commentId, text, author });

    return reply;
  }

  async toggleReplyUpvoteById(
    id: Types.ObjectId,
    replyId: string,
  ): Promise<void> {
    const reply = await Reply.findById(replyId);

    if (reply?.upvoted_users.some((uid) => uid === id)) {
      await Reply.findByIdAndUpdate(replyId, {
        $pull: { upvoted_users: id },
      });
    } else {
      await Reply.findByIdAndUpdate(replyId, {
        $addToSet: { upvoted_users: id },
      });
    }
  }

  async updateReplyTextById(
    _id: string,
    text: string,
    currentUser: IUser,
  ): Promise<IReplies | null> {
    const updatedReply = await Reply.findOneAndUpdate(
      { _id, author: currentUser._id },
      { text },
      { new: true },
    );

    return updatedReply;
  }

  async deleteReplyById(id: string): Promise<IReplies | null> {
    const reply = await Reply.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    return reply;
  }
}

export default new ReplyServices();
