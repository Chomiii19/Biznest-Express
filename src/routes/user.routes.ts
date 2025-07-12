import express from "express";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router
  .route("/:userId")
  .get(userController.getUser)
  .patch(userController.updateUser);

router.route("/block/:userId").patch(userController.toggleUserBlocklist);

export default router;
