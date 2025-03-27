const cron = require("node-cron");
const syncDatas = require("./config/syncDatas");
const express = require("express");
const app = express();

// cron.schedule("* * * * *", () => {
//   console.log("Running data sync every 1 minutes...");
//   syncDatas();
// });

setInterval(() => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Running sync every 10 seconds...`
  );
  syncDatas();
}, 10 * 1000);

// const pointController = require("./controllers/pointControllers");
// const pointRoutes = require("./routes/pointRoutes");

// app.use(express.json());
// app.use("/api/points", pointRoutes);

// pointController.scheduleUpdateAllPoints();

module.exports = app;
