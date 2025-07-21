import express from "express";
import * as replyController from "../controllers/reply.controller";

const router = express.Router();

router
  .route("/:replyId")
  .patch(replyController.updateReply)
  .delete(replyController.deleteReply);

router.route("/:replyId/toggle-upvote").patch(replyController.toggleUpvote);

export default router;
