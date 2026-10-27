"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssetNotification extends Model {
    static associate(models) {
      // Định nghĩa quan hệ: Một thông báo thuộc về một tài sản cụ thể
      this.belongsTo(models.Asset, {
        foreignKey: "AssetId",
        as: "asset",
      });
    }
  }

  AssetNotification.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      AssetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblAsset", // Tham chiếu đến bảng tblAsset
          key: "Id",
        },
      },
      NotifyBeforeDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      NotifyOnExpire: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      LastSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "AssetNotification",
      tableName: "tblAssetNotification",
      timestamps: true, // Tự động tạo createdAt và updatedAt
    }
  );

  return AssetNotification;
};
