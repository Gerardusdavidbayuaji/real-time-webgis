require("dotenv").config();

const app = require("./server");
const http = require("http");
// const initSocket = require("./config/socket");

const server = http.createServer(app);
// const io = initSocket(server);

server.listen(3000, () => {
  console.log("server running on port 3000...");
});
