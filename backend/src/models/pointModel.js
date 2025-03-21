const pool = require("../config/db");

const getAllPointById = async () => {
  try {
    const [rows] = await pool.query("SELECT id FROM sensor_sempor");
    console.log("Debug result", rows);
    return rows;
  } catch (error) {
    console.error("Error fetching point IDs:", error.message);
    return [];
  }
};

const updatePointById = async (id, data) => {
  const query = `
  UPDATE sensor_sempor
  SET value = ?
  WHERE id = ?
  `;

  try {
    const [result] = await pool.query(query, [data.value, id]);
    console.log("Update successful:", result);
  } catch (error) {
    console.error("Error updating point:", error.message);
  }
};

const getAllPoints = async () => {
  try {
    const [rows] = await pool.query("SELECT id FROM sensor_sempor");
    return rows;
  } catch (error) {
    console.error("Error fetching point IDs:", error.message);
    return [];
  }
};

module.exports = {
  getAllPointById,
  updatePointById,
  getAllPoints,
};
