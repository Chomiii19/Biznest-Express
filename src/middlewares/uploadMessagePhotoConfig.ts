import multer from "multer";
import fs from "fs";
import path from "path";
import AppError from "../utils/appError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname !== "image") {
      return cb(new AppError("Only 'image' field is allowed", 400), "");
    }

    const uploadPath = path.resolve(process.cwd(), "assets/images/messages/");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9.\-_]/g, "");

    cb(null, `${uniqueSuffix}-${cleanName}`);
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
    cb(
      new AppError("Invalid file type! Only JPEG, PNG, and JPG allowed.", 400),
    );
  }
};

const uploadMessagePhotoConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export default uploadMessagePhotoConfig;
