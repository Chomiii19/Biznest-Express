import express from "express";
import * as commentController from "../controllers/commentController";

const router = express.Router();

router
  .route("/:commentId")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

export default router;
