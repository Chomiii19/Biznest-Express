import { PipelineStage, Types } from "mongoose";
import { IConversation, IMessage, IUser } from "../@types/interfaces";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import AppError from "../utils/appError";

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

  async findAllConversationMessages(
    conversationId: string,
    currentUser: IUser,
    query: any,
  ): Promise<{
    messages: IMessage[];
    page: number;
    hasMore: boolean;
  }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sort || "-createdAt";

    const conversationObjectId = new Types.ObjectId(conversationId);

    const basePipeline: PipelineStage[] = [
      {
        $match: {
          conversation: conversationObjectId,
        },
      },
      {
        $sort: {
          createdAt: sortBy.startsWith("-") ? -1 : 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const messages: IMessage[] = await Message.aggregate(basePipeline);

    await Message.updateMany(
      {
        conversation: conversationObjectId,
        isRead: { $ne: currentUser._id },
      },
      {
        $addToSet: { isRead: currentUser._id },
      },
    );

    const nextPage = await Message.aggregate([
      { $match: { conversation: conversationObjectId } },
      { $sort: { createdAt: sortBy.startsWith("-") ? -1 : 1 } },
      { $skip: skip + limit },
      { $limit: 1 },
    ]);

    return {
      messages,
      page,
      hasMore: nextPage.length > 0,
    };
  }

  async findMessageById(messageId: string): Promise<IMessage> {
    const message = await Message.findById(messageId);
    if (!message) throw new AppError("Message not found", 404);

    return message;
  }

  async findMessageByIdAndUpdate(
    messageId: string,
    currentUserId: Types.ObjectId,
    text: string,
  ): Promise<void> {
    const message = await Message.findOneAndUpdate(
      { _id: messageId, user: currentUserId, isDeleted: false },
      { "content.text": text },
    );

    if (!message) throw new AppError("Message not found or unauthorized", 404);
  }

  async findByIdAndDelete(
    userId: Types.ObjectId,
    messageId: string,
  ): Promise<void> {
    const message = await this.findMessageById(messageId);

    if (!message) throw new AppError("Message not found", 404);

    if (!message.user.equals(userId))
      throw new AppError("User is not authorized", 400);

    message.isDeleted = true;
    message.content.text = "This message has been deleted";
    message.content.type = "text";
    await message.save();
  }

  async createConversation(usersId: string[]): Promise<Types.ObjectId> {
    const conversation = await Conversation.findOne({
      $and: usersId.map((id) => ({
        "users.user": new Types.ObjectId(id),
      })),
      users: { $size: usersId.length },
    });

    if (conversation) return conversation._id;

    const newConversation = await Conversation.create({
      users: usersId.map((id) => ({
        user: new Types.ObjectId(id),
      })),
    });

    return newConversation._id;
  }

  async createMessage(message: IMessage, usersId: string[]): Promise<IMessage> {
    let conversationId = new Types.ObjectId();

    if (!message.conversationId) {
      conversationId = await this.createConversation(usersId);
    }

    const messsage = await Message.create({
      conversationId,
      user: message.user,
      content: { type: message.content.type, text: message.content.text },
      isRead: [message.user],
    });

    return message;
  }
}

export default new MessageServices();
