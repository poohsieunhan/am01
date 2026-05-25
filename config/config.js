require('dotenv').config(); // Nạp biến môi trường từ file .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    timezone: '+07:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      ssl: {
        rejectUnauthorized: false // Giữ cấu hình SSL cho Aiven Cloud
      }
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    timezone: '+07:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
};