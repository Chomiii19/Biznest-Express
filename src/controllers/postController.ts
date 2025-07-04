import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import PostServices from "../services/postServices";

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await PostServices.getAllPosts(req.query);

    res.status(200).json({ status: "Success", data });
  },
);

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getAllComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  getAllComments,
  createComment,
};
