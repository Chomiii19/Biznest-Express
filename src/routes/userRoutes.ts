import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router
  .route("/:userId")
  .get(userController.getUser)
  .patch(userController.updateUser);

router.route("/block/:userId").patch(userController.toggleUserBlocklist);
