"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssetRelation extends Model {
    static associate(models) {
      // Định nghĩa các mối quan hệ nếu cần, ví dụ:
      // this.belongsTo(models.Asset, { as: 'MainAsset', foreignKey: 'AssetId' });
      // this.belongsTo(models.Asset, { as: 'RelatedAsset', foreignKey: 'RelatedAssetId' });
    }
  }

  AssetRelation.init(
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
          model: "tblAsset",
          key: "Id",
        },
      },
      RelatedAssetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblAsset",
          key: "Id",
        },
      },
      RelationType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AssetRelation",
      tableName: "tblAssetRelation",
      timestamps: true,
    }
  );

  return AssetRelation;
};
