import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import app from "./app";
import { Server } from "socket.io";
import socketServer from "./socket";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB = `${process.env.DB}`.replace(
  "<db_password>",
  process.env.DB_PASSWORD as string,
);
const server = http.createServer(app);
const io = new Server(server);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Successfully connected to DB...");

    server.listen(PORT, () => {
      console.log("Successfully connected to port: ", PORT);
      socketServer(io);
    });
  })
  .catch((err) => console.error("Failed connection to DB:", err));
