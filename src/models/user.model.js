"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Định nghĩa quan hệ tại đây nếu cần
    }
  }

  User.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      LoginName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "tblUser",
      timestamps: false,
    }
  );

  return User;
};
