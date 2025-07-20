import express from "express";
import * as messageController from "../controllers/message.controller";

const router = express.Router();

router
  .route("/messages/:messageId")
  .patch(messageController.updateMessage)
  .delete(messageController.deleteMessage);
router.route("/:conversationId").get(messageController.getConversation);
router.route("/").get(messageController.getAllConversations);

export default router;
