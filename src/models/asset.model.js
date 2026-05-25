"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Định nghĩa quan hệ: Một Asset thuộc về một Company
      this.belongsTo(models.Company, { foreignKey: "CompanyId" });
      this.belongsTo(models.AssetType, { foreignKey: "AssetTypeId" , as: "assetTypeId" });
    }
  }

  Asset.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      AssetTypeId: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      Code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      Status: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      StartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ExpireDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      CompanyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblCompany",
          key: "Id",
        },
      },
      AccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ProjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Asset",
      tableName: "tblAsset",
      timestamps: true,
    }
  );

  return Asset;
};
