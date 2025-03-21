// //used postgreSQL
// const pool = require("../config/db");

// const getAllPointIds = async () => {
//   const result = await pool.query("SELECT id FROM lokasi_alat");
//   return result.rows;
// };

// const updatePointById = async (id, data) => {
//   const query = `
//     UPDATE lokasi_alat
//     SET elevasi = $1,
//         volume = $2,
//         trend = $3,
//         status = $4,
//         update_at = $5
//     WHERE id = $6
//   `;
//   await pool.query(query, [
//     data.elevasi,
//     data.volume,
//     data.trend,
//     data.status,
//     data.update_at,
//     id,
//   ]);
// };

// // Fungsi untuk mendapatkan semua data dari tabel
// const getAllPoints = async () => {
//   const result = await pool.query("SELECT * FROM lokasi_alat");
//   return result.rows;
// };

// module.exports = {
//   getAllPointIds,
//   updatePointById,
//   getAllPoints,
// };

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
