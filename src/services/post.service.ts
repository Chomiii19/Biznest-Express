import { PipelineStage, Types } from "mongoose";
import { IPost, IUser } from "../@types/interfaces";
import Post from "../models/post.model";
import AppError from "../utils/appError";

class PostServices {
  async getAllPosts(
    query: any,
    currentUser: IUser,
  ): Promise<{ posts: IPost[]; page: number; hasMore: boolean }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sort || "-createdAt";

    const filters: any = { status: "approved" };
    if (query.search) filters.$text = { $search: query.search };
    if (query.city) filters.address = { $regex: query.city, $options: "i" };

    if (query.price) {
      switch (query.price) {
        case "<5000":
          filters.price = { $lt: 5000 };
          break;
        case "5001-10000":
          filters.price = { $gte: 5001, $lte: 10000 };
          break;
        case "10001-20000":
          filters.price = { $gte: 10001, $lte: 20000 };
          break;
        case ">20000":
          filters.price = { $gt: 20000 };
          break;
      }
    }

    if (query.size) {
      switch (query.size) {
        case "<50":
          filters.size = { $lt: 50 };
          break;
        case "50-100":
          filters.size = { $gte: 50, $lte: 100 };
          break;
        case "100+":
          filters.size = { $gt: 100 };
          break;
      }
    }

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

    const posts = await Post.aggregate([
      ...basePipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const nextPage = await Post.aggregate([
      ...basePipeline,
      { $skip: skip + limit },
      { $limit: 1 },
    ]);

    return {
      posts,
      page,
      hasMore: nextPage.length > 0,
    };
  }

  async createPost(
    userId: Types.ObjectId,
    description: string,
    address: string,
    size: number,
    proof: string,
    images_url: string[],
    price: number | null = null,
  ): Promise<IPost | null> {
    const post = await Post.create({
      author: userId,
      description,
      address,
      size,
      proof,
      images_url,
      price,
    });

    return post;
  }

  async getPostById(id: string): Promise<IPost | null> {
    const post = await Post.findById(id).populate("author");

    return post;
  }

  async getPostByIdAndUpdate(
    userId: Types.ObjectId,
    postId: string,
    contents: IPost,
  ): Promise<void> {
    const post = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      contents,
    );

    if (!post) throw new AppError("Post not found or unauthorized", 404);
  }

  async getPostByIdAndDelete(
    userId: Types.ObjectId,
    postId: string,
  ): Promise<void> {
    const post = await this.getPostById(postId);

    if (!post) throw new AppError("Post not found", 404);

    const authorId =
      post.author instanceof Types.ObjectId
        ? post.author
        : (post.author as IUser)._id;

    if (!authorId.equals(userId))
      throw new AppError("User is not authorized", 400);

    post.status = "deleted";
    await post.save();
  }
}
export default new PostServices();
