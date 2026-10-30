const { Sequelize } = require("sequelize");
const path = require("path");
// Đọc file config.json từ thư mục gốc của dự án
const config = require(path.resolve(__dirname, "../../config/config.js"));

// Xác định môi trường (mặc định là development)
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env] || config.development || config.dev;

if (!dbConfig) {
  throw new Error(
    `Không tìm thấy cấu hình cho môi trường "${env}" trong config.js`
  );
}

// Tạo instance Sequelize sử dụng dbConfig
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    ...dbConfig,
    logging: console.log, // Bật log để debug SQL
    define: {
      timestamps: true,
    },
  }
);

async function queryRaw(sql, replacements = {}) {
  const [results, metadata] = await sequelize.query(sql, {
    replacements: replacements,
  });
  return results; // Trả về mảng dữ liệu giống hệt mysql2/promise
}

// Hàm kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Kết nối Sequelize (${env}) với Database thành công.`);
  } catch (error) {
    console.error("❌ Lỗi kết nối Sequelize:", error);
  }
}

testConnection();

module.exports = { sequelize, queryRaw };
