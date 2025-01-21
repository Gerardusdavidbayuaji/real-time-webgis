const pointModel = require("../models/pointModel");

const getAllPoints = async (req, res) => {
  try {
    const points = await pointModel.getAllPoints();
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllPoints };
