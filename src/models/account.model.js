"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      // Định nghĩa quan hệ tại đây
    }
  }
  Account.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      Name: { type: DataTypes.STRING(20), allowNull: false },
      Username: { type: DataTypes.STRING(20), allowNull: false },
      Password: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "tblAccount",
      timestamps: true,
    }
  );
  return Account;
};
