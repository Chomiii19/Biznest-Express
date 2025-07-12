import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRoute from "./routes/auth.routes";
import postRoute from "./routes/post.routes";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/globalErrorHandler";

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);
app.use("/{*splat}", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`Can't find ${req.originalUrl} from the server.`, 404)),
);
app.use(globalErrorHandler);

export default app;
