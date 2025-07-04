import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.route("/google").post(authController.googleAuth);
router.route("/facebook").post(authController.facebookAuth);
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/password/reset").patch(authController.resetPassword);
router
  .route("/password/request-reset")
  .post(authController.requestResetPassword);
router.route("/password/request-reset/check-otp").post(authController.checkOTP);

export default router;
