import { IPost } from "../@types/interfaces";
import Post from "../models/postModel";

class PostServices {
  async getAllPosts(): Promise<IPost[]> {
    const posts = await Post.find();

    return posts;
  }
}

export default new PostServices();
