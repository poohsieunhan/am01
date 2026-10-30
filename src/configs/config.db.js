const mysql = require("mysql2/promise");
const path = require("path");
const config = require(path.resolve(__dirname, "../../config/config.js"));

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env] || config.development || config.dev;

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: dbConfig.timezone || "+07:00",
  ssl: dbConfig.dialectOptions?.ssl || false,
});

module.exports = pool;

