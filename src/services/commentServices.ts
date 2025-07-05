import { IComments } from "../@types/interfaces";
import Comment from "../models/commentModel";

class CommentServices {
  async findCommentById(id: string): Promise<IComments | null> {
    const comments = await Comment.findById(id);
    return comments;
  }

  async updateCommentTextById(
    id: string,
    text: string,
  ): Promise<IComments | null> {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true },
    );

    return updatedComment;
  }
}

export default new CommentServices();
