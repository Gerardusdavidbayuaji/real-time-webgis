require("dotenv").config();
const axios = require("axios");
const pool = require("../config/db");

async function syncDatas() {
  try {
    const response = await axios.get(process.env.PARAMETER_SENSOR);
    const data = response.data.data;

    const connection = await pool.getConnection();

    for (const idSensor in data) {
      const records = data[idSensor];

      for (const record of records) {
        const { id, nmfield, satuan, keterangan, value } = record;

        const sql = `
                INSERT INTO lokasi_sensor_sempor (id, nama_sensor, nmfield, satuan, keterangan, value)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                nmfield = VALUES(nmfield),
                satuan = VALUES(satuan),
                value = VALUES(value),
                keterangan = VALUES(keterangan)
            `;

        await connection.execute(sql, [
          id,
          idSensor,
          nmfield,
          satuan,
          keterangan,
          value,
        ]);
      }
    }

    await connection.release();
    console.log("Successfully saved the datas...");
  } catch (error) {
    console.log("Upps, failed saving the datas...", error.message);
  }
}

module.exports = syncDatas;
