import express from "express";
import * as postController from "../controllers/post.controller";
import uploadPhoto from "../middlewares/uploadPhotoConfig";

const router = express.Router();

router
  .route("/:postId/comments")
  .get(postController.getAllComments)
  .post(postController.createComment);

router
  .route("/:postId")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

router
  .route("/")
  .get(postController.getAllPosts)
  .post(uploadPhoto, postController.createPost);

export default router;
