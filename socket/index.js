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
