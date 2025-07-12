import express from "express";
import * as replyController from "../controllers/reply.controller";

const router = express.Router();

router
  .route("/:commentId")
  .get(replyController.getReplies)
  .post(replyController.createReply);

router
  .route("/:replyId")
  .patch(replyController.updateReply)
  .delete(replyController.deleteReply);

export default router;
