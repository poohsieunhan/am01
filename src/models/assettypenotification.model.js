"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssetTypeNotification extends Model {
    static associate(models) {
      // Định nghĩa quan hệ: Một thông báo thuộc về một loại tài sản
      // this.belongsTo(models.AssetType, { foreignKey: 'AssetTypeId' });
    }
  }

  AssetTypeNotification.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      AssetTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblAssetType",
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
      modelName: "AssetTypeNotification",
      tableName: "tblAssetTypeNotification",
      timestamps: true,
    }
  );

  return AssetTypeNotification;
};
