import express from "express";
import * as locationController from "../controllers/location.controller";

const router = express.Router();

router
  .route("/locations/bookmarks")
  .get(locationController.getAllBookmarks)
  .post(locationController.createBookmark);
router
  .route("/locations/bookmarks/:bookmarkId")
  .patch(locationController.updateBookmark)
  .delete(locationController.deleteBookmark);
router.route("/locations/nearby-posts").get(locationController.nearbyPosts);
router.route("/location/summary").get(locationController.summary);

export default router;
