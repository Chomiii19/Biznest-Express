import express from "express";
import * as commentController from "../controllers/commentController";

const router = express.Router();

router
  .route("/:commentId")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

router
  .route("/:commendId/replies")
  .get(commentController.getReplies)
  .post(commentController.createReply);

router
  .route("/:commentId/replies/:replyId")
  .patch(commentController.updateReply)
  .delete(commentController.deleteReply);

export default router;
