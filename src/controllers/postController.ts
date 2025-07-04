import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import PostServices from "../services/postServices";
import AppError from "../utils/appError";
import { MulterFields } from "../@types/interfaces";

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await PostServices.getAllPosts(req.query);

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
