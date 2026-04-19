import express from "express";
import * as locationController from "../controllers/location.controller";

const router = express.Router();

router
  .route("/bookmarks")
  .get(locationController.getAllBookmarks)
  .post(locationController.createBookmark);
router
  .route("/bookmarks/:bookmarkId")
  .patch(locationController.updateBookmark)
  .delete(locationController.deleteBookmark);
router.route("/nearby-posts").get(locationController.nearbyPosts);
router.route("/summary").get(locationController.summary);
router.route("/score").post(locationController.computeLocationScore);

export default router;
