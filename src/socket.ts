import { DefaultEventsMap, Server } from "socket.io";
import MessageServices from "./services/message.service";

type ioType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

interface ISocketUsers {
  userId: string;
  socketId: string;
}

let activeUsers: ISocketUsers[] = [];

export default function socketServer(io: ioType) {
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

    socket.on("send-message", async (data) => {
      const { usersId, message } = data;

      if (!message.content?.text?.trim()) {
        return io
          .to(socket.id)
          .emit("error", { message: "Invalid empty text" });
      }

      try {
        const savedMessage = await MessageServices.createMessage(
          message,
          usersId,
        );

        for (const userId of usersId) {
          const userSocket = activeUsers.find((u) => u.userId === userId);

          if (userId === message.user.toString()) continue;

          if (userSocket) {
            io.to(userSocket.socketId).emit("receive-message", {
              message: savedMessage,
              usersId,
            });
          }
        }

        io.to(socket.id).emit("message-sent", savedMessage);
      } catch (err: any) {
        io.to(socket.id).emit("error", {
          message: err?.message ?? "Unable to send message",
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
