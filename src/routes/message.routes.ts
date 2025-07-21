import express from "express";
import * as messageController from "../controllers/message.controller";
import uploadMessagePhotoConfig from "../middlewares/uploadMessagePhotoConfig";

const router = express.Router();

router
  .route("/messages/:messageId")
  .patch(messageController.updateMessage)
  .delete(messageController.deleteMessage);
router
  .route("/:conversationId")
  .get(messageController.getConversation)
  .post(uploadMessagePhotoConfig, messageController.sendMessage);
router.route("/").get(messageController.getAllConversations);

export default router;
