const pool = require("../config/db");

const getAllPoints = async () => {
  const result = await pool.query("SELECT * FROM lokasi_alat");
  return result.rows;
};

module.exports = { getAllPoints };
