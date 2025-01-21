const express = require("express");
const pointRoutes = require("./routes/pointRoutes");

const app = express();
app.use(express.json());

// route
app.use("/api/points", pointRoutes);

module.exports = app;
