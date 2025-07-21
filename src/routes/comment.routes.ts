import express from "express";
import * as commentController from "../controllers/comment.controller";

const router = express.Router();

router
  .route("/:commentId")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

router.route("/:commentId/toggle-upvote").patch(commentController.toggleUpvote);

router
  .route("/:commentId/replies")
  .get(commentController.getReplies)
  .post(commentController.createReply);

export default router;
