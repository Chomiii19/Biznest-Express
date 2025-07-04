import multer from "multer";
import fs from "fs";
import path from "path";
import AppError from "../utils/appError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";

    if (file.fieldname === "postImages")
      uploadPath = path.resolve(process.cwd(), "assets/images/post/");
    else if (file.fieldname === "proof")
      uploadPath = path.resolve(process.cwd(), "assets/images/proof/");
    else return cb(new AppError("Unknown file field!", 400), "");

    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = function (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type!", 400));
  }
};

const uploadPhoto = multer({
  storage,
  fileFilter,
}).fields([
  { name: "postImages", maxCount: 10 },
  { name: "proof", maxCount: 1 },
]);

export default uploadPhoto;
