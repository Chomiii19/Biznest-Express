import { IComments } from "../@types/interfaces";
import Comment from "../models/comment.model";

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

  async toggleCommentUpvoteById(id: string, commentId: string): Promise<void> {
    const comment = await Comment.findById(commentId);

    if (comment?.upvoted_users.some((uid) => uid.toString() === id)) {
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
