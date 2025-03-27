const cron = require("node-cron");
const syncDatas = require("./config/syncDatas");
const express = require("express");
const app = express();

setInterval(() => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Running sync every 5 seconds...`
  );
  syncDatas();
}, 5 * 1000);

// const pointController = require("./controllers/pointControllers");
// const pointRoutes = require("./routes/pointRoutes");

// app.use(express.json());
// app.use("/api/points", pointRoutes);

// pointController.scheduleUpdateAllPoints();

module.exports = app;
