import express from "express";
import { googleAuth } from "../controllers/authController";

const router = express.Router();

router.route("/google").post(googleAuth);

export default router;
