const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: process.env.DB_HOST_MYSQL,
  user: process.env.DB_USER_MYSQL,
  database: process.env.DB_NAME_MYSQL,
  password: process.env.DB_PASSWORD_MYSQL,
  port: process.env.DB_PORT_MYSQL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
