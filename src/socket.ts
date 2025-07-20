import { DefaultEventsMap, Server } from "socket.io";

type ioType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

interface ISocketUsers {
  userId: string;
  socketId: string;
}

let activeUsers: ISocketUsers[] = [];

export default function socketServer(io: ioType) {
  io.on("connection", (socket) => {
    socket.on("add-new-user", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({
          userId: newUserId,
          socketId: socket.id,
        });
      }

      console.log("Connected Users", activeUsers);
      io.emit("get-users", activeUsers);
    });

    socket.on("send-message", (data) => {
      const { recipientId } = data;
      const recipient = activeUsers.find((user) => user.userId === recipientId);

      if (recipient) {
        io.to(recipient.socketId).emit("recieve-message", data);
      }
    });

    socket.on("disconnect", () => {
      activeUsers.filter((user) => user.socketId !== socket.id);

      console.log("User Disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });
  });
}
