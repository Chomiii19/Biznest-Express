import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import PostServices from "../services/post.service";
import AppError from "../utils/appError";
import { IUser, MulterFields } from "../@types/interfaces";

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await PostServices.getAllPosts(req.query, req.user._id);

    res.status(200).json({ status: "Success", data });
  },
);

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const files = req.files as MulterFields;
    const { description, address, price, size } = req.body;

    if (!description || !address || !size || !files.proof?.[0]?.path)
      return next(
        new AppError(
          "Invalid empty fields for description, address, proof, and size",
          400,
        ),
      );

    const post = await PostServices.createPost(
      user._id,
      description,
      address,
      size,
      files.proof?.[0]?.path,
      files.postImages?.map((file) => file.path) || [],
      price,
    );

    res.status(201).json({ status: "Success", post });
  },
);

const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    if (!postId) return next(new AppError("Invalid empty postId", 400));

    const post = await PostServices.getPostById(postId);

    if (
      !post ||
      post.status !== "approved" ||
      (post.author as IUser).blocked.includes(req.user._id)
    )
      return next(new AppError("Post not found", 404));

    res.status(200).json({ staus: "Success", data: post });
  },
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    if (!postId) return next(new AppError("Invalid empty postId", 400));

    await PostServices.getPostByIdAndDelete(req.user._id, postId);

    res.status(200).json({ status: "Successfully deleted" });
  },
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
