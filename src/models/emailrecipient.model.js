"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmailRecipient extends Model {
    static associate(models) {
      // Định nghĩa các mối quan hệ (associations) ở đây
    }
  }

  EmailRecipient.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Email: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          isEmail: true, // Thêm validation để đảm bảo định dạng email chuẩn
        },
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "EmailRecipient",
      tableName: "tblEmailRecipient",
      timestamps: true,
    }
  );

  return EmailRecipient;
};
