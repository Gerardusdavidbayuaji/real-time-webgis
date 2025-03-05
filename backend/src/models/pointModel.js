const pool = require("../config/db");

const getAllPointIds = async () => {
  const result = await pool.query("SELECT id FROM lokasi_alat");
  return result.rows;
};

const updatePointById = async (id, data) => {
  const query = `
    UPDATE lokasi_alat
    SET elevasi = $1,
        volume = $2,
        trend = $3,
        status = $4,
        update_at = $5
    WHERE id = $6
  `;
  await pool.query(query, [
    data.elevasi,
    data.volume,
    data.trend,
    data.status,
    data.update_at,
    id,
  ]);
};

// Fungsi untuk mendapatkan semua data dari tabel
const getAllPoints = async () => {
  const result = await pool.query("SELECT * FROM lokasi_alat");
  return result.rows;
};

module.exports = {
  getAllPointIds,
  updatePointById,
  getAllPoints,
};
