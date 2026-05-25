"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tblEmailConfig", {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Host: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Port: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      Secure: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      Username: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      Password: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      FromEmail: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      FromName: {
        type: Sequelize.STRING(50),
        allowNull: false,
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
    await queryInterface.dropTable("tblEmailConfig");
  },
};
