const mysql = require("mysql2/promise");
const path = require("path");
const config = require(path.resolve(__dirname, "../../config/config.js"));

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,

  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
