const express = require("express");
const app = express();

const pointController = require("./controllers/pointControllers");
const pointRoutes = require("./routes/pointRoutes");

app.use(express.json());
app.use("/api/points", pointRoutes);

pointController.scheduleUpdateAllPoints();

module.exports = app;
