import express from "express";
import * as replyController from "../controllers/reply.controller";

const router = express.Router();

router.route("/:commentId").get().post();

router.route("/:replyId").patch().delete();

export default router;
