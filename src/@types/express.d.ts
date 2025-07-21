import { IUser } from "./interfaces";
import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      files?: {
        postImages?: Multer.File[];
        proof?: Multer.File[];
      };
      file?: Multer.File;
    }
  }
}
