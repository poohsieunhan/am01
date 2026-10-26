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
      // Định nghĩa quan hệ
      this.belongsTo(models.Company, { foreignKey: "CompanyId", as: "company" });
      this.belongsTo(models.AssetType, { foreignKey: "AssetTypeId", as: "assetTypeId" });
      this.belongsTo(models.Account, { foreignKey: "AccountId", as: "account" });
      this.belongsTo(models.Project, { foreignKey: "ProjectId", as: "project" });
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
