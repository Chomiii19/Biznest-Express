import { IPost } from "../@types/interfaces";
import Post from "../models/postModel";

class PostServices {
  async getAllPosts(
    query: any,
  ): Promise<{ posts: IPost[]; page: number; hasMore: boolean }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sort || "-createdAt";

    const filters: any = {};
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

    const posts = await Post.find(filters).sort(sortBy).skip(skip).limit(limit);

    const nextPagePosts = await Post.find(filters)
      .sort("-createdAt")
      .skip(skip + limit)
      .limit(1);

    return {
      posts,
      page,
      hasMore: nextPagePosts.length > 0,
    };
  }
}

export default new PostServices();
