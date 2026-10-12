"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      // Định nghĩa quan hệ ở đây nếu cần
    }
  }

  Company.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TenCongTy: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      DiaChi: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      MaSoThue: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          isEmail(value) {
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              throw new Error("Email không đúng định dạng.");
            }
          },
        },
      },
      Tel: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      Fax: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      NguoiDaiDien: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      ChucVu: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "tblCompany",
      timestamps: true,
    }
  );

  return Company;
};
