"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tblAsset", {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      AssetTypeId: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      Code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      Name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      Status: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      StartDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ExpireDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      CompanyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tblCompany",
          key: "Id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      AccountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ProjectId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tblAsset");
  },
};
