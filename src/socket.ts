import { DefaultEventsMap, Server } from "socket.io";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import MessageServices from "./services/message.service";

type serverType = http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

interface ISocketUsers {
  userId: string;
  socketId: string;
}

export let activeUsers: ISocketUsers[] = [];
let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export function initSocketServer(server: serverType) {
  io = new Server(server);

  io.on("connection", (socket) => {
    socket.on("add-new-user", (newUserId) => {
      const existingUser = activeUsers.find(
        (user) => user.userId === newUserId,
      );

      if (existingUser) existingUser.socketId = socket.id;
      else activeUsers.push({ userId: newUserId, socketId: socket.id });

      console.log("Connected Users", activeUsers);
      io.emit("get-users", activeUsers);
    });



    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

    socket.on("send-image", async (data) => {
      try {
        const { buffer, originalName, usersId, senderId, mimeType } = data;

        // 🔐 Validate buffer
        if (!Buffer.isBuffer(buffer)) {
          return io.to(socket.id).emit("error", {
            message: "Invalid file format",
          });
        }

        // 🔐 Validate size
        if (buffer.length > MAX_FILE_SIZE) {
          return io.to(socket.id).emit("error", {
            message: "File too large. Max size is 5MB",
          });
        }

        // 🔐 Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
          return io.to(socket.id).emit("error", {
            message: "Unsupported image type",
          });
        }

        // ✅ Generate a safe, unique filename
        const extension = mime.extension(mimeType) || "jpg";
        const filename = `${uuidv4()}.${extension}`;
        const uploadDir = path.join(__dirname, "uploads");

        // 🔐 Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // ✅ Save image
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        const imageUrl = `/uploads/${filename}`;

        // ✅ Broadcast message to other users
        for (const userId of usersId) {
          const userSocket = activeUsers.find((u) => u.userId === userId);
          if (userSocket) {
            io.to(userSocket.socketId).emit("receive-message", {
              message: {
                user: senderId,
                content: {
                  type: "image",
                  text: imageUrl,
                },
              },
            });
          }
        }

        // ✅ Optional: Acknowledge sender
        io.to(socket.id).emit("message-sent", {
          user: senderId,
          content: { type: "image", text: imageUrl },
        });
      } catch (err: any) {
        console.error("Image upload failed:", err);
        io.to(socket.id).emit("error", {
          message: "Failed to upload image",
        });
      }
    });


    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

      console.log("User Disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });
  });
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
