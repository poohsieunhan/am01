const multer = require("multer");

const storage = multer.memoryStorage();

const uploadExcel = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(new Error("Chỉ hỗ trợ file Excel .xlsx, .xls"));
    }
    cb(null, true);
  },
});

module.exports = uploadExcel;
