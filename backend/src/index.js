require("dotenv").config();

const app = require("./server");
const http = require("http");
const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Server running on port 3000...");
});
