"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmailConfig extends Model {
    static associate(models) {
      // Định nghĩa các mối quan hệ nếu có
    }
  }

  EmailConfig.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Host: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Port: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      Secure: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      Username: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
      },
      Password: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
      },
      FromEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      FromName: {
        type: DataTypes.STRING(100),
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
      modelName: "EmailConfig",
      tableName: "tblEmailConfig",
      timestamps: true,
    }
  );

  return EmailConfig;
};
