const express = require("express");
const app = express();

const pointRoutes = require("./routes/pointRoutes");
const pointController = require("./controllers/pointControllers");

app.use(express.json());
app.use("/api/points", pointRoutes);

pointController.scheduleUpdateAllPoints();

module.exports = app;
