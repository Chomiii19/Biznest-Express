import { IReplies } from "../@types/interfaces";
import Reply from "../models/reply.model";
import { Types } from "mongoose";

class ReplyServices {
  async getRepliesByCommentId(
    commentId: string,
    query: any,
  ): Promise<{ replies: IReplies[]; page: number; hasMore: boolean }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sort || "-createdAt";
    const filters = { commentId, isDeleted: false };

    const replies = await Reply.find(filters)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const nextPageReplies = await Reply.find(filters)
      .sort("-createdAt")
      .skip(skip + limit)
      .limit(1);

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
    id: string,
    text: string,
  ): Promise<IReplies | null> {
    const updatedReply = await Reply.findByIdAndUpdate(
      id,
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
