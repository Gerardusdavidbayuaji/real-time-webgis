const syncDatas = require("./config/syncDatas");
const express = require("express");
const app = express();

setInterval(() => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Running sync every 5 seconds...`
  );
  syncDatas();
}, 5 * 1000);

module.exports = app;
