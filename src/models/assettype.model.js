"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssetType extends Model {
    static associate(models) {
      // Định nghĩa quan hệ: Một loại tài sản có nhiều thông báo cấu hình
      this.hasMany(models.AssetTypeNotification, { foreignKey: "AssetTypeId" });
    }
  }
  AssetType.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      Code: { type: DataTypes.STRING(50), allowNull: false },
      Name: { type: DataTypes.STRING(150), allowNull: false },
      HasExpire: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      sequelize,
      modelName: "AssetType",
      tableName: "tblAssetType",
      timestamps: true,
    }
  );
  return AssetType;
};
