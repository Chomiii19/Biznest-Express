import { PipelineStage } from "mongoose";
import { IConversation, IUser } from "../@types/interfaces";
import Conversation from "../models/conversation.model";

class MessageServices {
  async findUserConversations(
    currentUser: IUser,
    query: any,
  ): Promise<{
    conversations: IConversation[];
    page: number;
    hasMore: boolean;
  }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sort || "-latestMessageDate";

    const basePipeline: PipelineStage[] = [
      { $unwind: "$users" },
      {
        $match: {
          "users.user": currentUser._id,
          "users.isHidden": false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users.user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $addFields: {
          otherUser: {
            $first: {
              $filter: {
                input: "$users",
                as: "u",
                cond: { $ne: ["$$u.user", currentUser._id] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUser.user",
          foreignField: "_id",
          as: "otherUserDetails",
        },
      },
      { $unwind: "$otherUserDetails" },
      {
        $match: {
          "otherUserDetails._id": { $nin: currentUser.blocked },
          "otherUserDetails.blocked": { $ne: currentUser._id },
          ...(query.search && {
            $or: [
              {
                "otherUserDetails.firstname": {
                  $regex: query.search,
                  $options: "i",
                },
              },
              {
                "otherUserDetails.surname": {
                  $regex: query.search,
                  $options: "i",
                },
              },
              {
                "otherUserDetails.username": {
                  $regex: query.search,
                  $options: "i",
                },
              },
            ],
          }),
        },
      },
      {
        $sort: {
          latestMessageDate: sortBy.startsWith("-") ? -1 : 1,
        },
      },
      {
        $project: {
          _id: 1,
          users: 1,
          latestMessage: 1,
          latestMessageDate: 1,
          otherUserDetails: {
            _id: 1,
            firstname: 1,
            surname: 1,
            username: 1,
          },
        },
      },
    ];

    const conversations = await Conversation.aggregate([
      ...basePipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const nextPage = await Conversation.aggregate([
      ...basePipeline,
      { $skip: skip + limit },
      { $limit: 1 },
    ]);

    return {
      conversations,
      page,
      hasMore: nextPage.length > 0,
    };
  }
}

export default new MessageServices();
