const express = require("express");
const router = express.Router();
const pointController = require("../controllers/pointControllers");

router.get("/", pointController.getAllPoints);

module.exports = router;
