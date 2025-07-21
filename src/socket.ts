import { DefaultEventsMap, Server } from "socket.io";
import http from "http";
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
