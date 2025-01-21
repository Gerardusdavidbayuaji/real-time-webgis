const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  return io;
};

module.exports = initSocket;
