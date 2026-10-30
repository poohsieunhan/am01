require('dotenv').config(); // Nạp biến môi trường từ file .env

const devConfig = {
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_DATABASE,
  host: process.env.DEV_DB_HOST,
  port: parseInt(process.env.DEV_DB_PORT || 3306),
  dialect: process.env.DEV_DB_DIALECT || 'mysql',
  timezone: '+07:00',
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    ssl: {
      rejectUnauthorized: false // Bật SSL cho Aiven Cloud
    }
  }
};

const prodConfig = {
  username: process.env.PROD_DB_USERNAME,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_DATABASE,
  host: process.env.PROD_DB_HOST,
  port: parseInt(process.env.PROD_DB_PORT || 3306),
  dialect: process.env.PROD_DB_DIALECT || 'mysql',
  timezone: '+07:00',
  dialectOptions: {
    dateStrings: true,
    typeCast: true
    // Production chạy on-premise/nội bộ không cần SSL
  }
};

module.exports = {
  dev: devConfig,
  prd: prodConfig
};
