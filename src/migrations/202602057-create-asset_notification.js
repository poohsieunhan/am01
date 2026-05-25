"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tblAssetNotification", {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      AssetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tblAsset",
          key: "Id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      NotifyBeforeDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      NotifyOnExpire: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      LastSentAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      Active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.dropTable("tblAssetNotification");
  },
};
