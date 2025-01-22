const {
  getAllPointIds,
  updatePointById,
  getAllPoints,
} = require("../models/pointModel");

const generateRandomData = () => {
  const elevasi = (Math.random() * 5).toFixed(1);
  const volume = Math.floor(Math.random() * 200) + 50;
  const trend = Math.random() > 0.5 ? "Meningkat" : "Menurun";
  const statusOptions = ["Normal", "Siaga", "Waspada", "Awas"];
  const status =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const update_at = new Date().toISOString();

  return { elevasi, volume, trend, status, update_at };
};

const fetchAllPoints = async (req, res) => {
  try {
    const points = await getAllPoints();
    res.status(200).json(points);
  } catch (error) {
    console.error("Opps, error fetching data", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const updateAllPoints = async () => {
  try {
    const pointIds = await getAllPointIds();

    for (const point of pointIds) {
      const randomData = generateRandomData();
      await updatePointById(point.id, randomData);
      console.log(`Updated ID: ${point.id}:`, randomData);
    }
    console.log("Update data Successfuly");
  } catch (error) {
    console.error("Opps, error update data:", error.message);
  }
};

const scheduleUpdateAllPoints = () => {
  setInterval(() => {
    updateAllPoints();
  }, 5000);
};

module.exports = {
  fetchAllPoints,
  scheduleUpdateAllPoints,
};
