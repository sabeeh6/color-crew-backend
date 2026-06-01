import { messageModel } from "../model/message.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId, callback) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const size = room ? room.size : 0;

      if (size >= 5) {
        if (callback) callback({ success: false, message: "Room is full" });
        return;
      }

      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      if (callback) callback({ success: true });
    });

    socket.on("canvas-update", (data) => {
      // data: { roomId, fabricJSON }
      socket.to(data.roomId).emit("on-canvas-update", data.fabricJSON);
    });

    socket.on("cursor-move", (data) => {
      // data: { roomId, x, y, username, userId }
      socket.to(data.roomId).emit("on-cursor-move", data);
    });

    socket.on("send-chat-message", async (data) => {
      // data: { roomId, sender, content, timestamp }
      try {
        // 1. Broadcast to other members in the room
        socket.to(data.roomId).emit("on-chat-message", data);

        // 2. Persist to Database
        await messageModel.create({
          sketch: data.roomId,
          sender: data.sender,
          content: data.content,
          timestamp: data.timestamp
        });

      } catch (error) {
        console.error("Error handling chat message socket event:", error);
      }
    });

    socket.on("send-reaction", (data) => {
      // Broadcast ephemeral reactions and comments to other clients in the room
      socket.to(data.roomId).emit("on-reaction", data);
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit("user-disconnected", socket.id);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
