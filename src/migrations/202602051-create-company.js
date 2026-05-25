"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tblCompany", {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TenCongTy: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      DiaChi: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      MaSoThue: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Tel: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      Fax: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      NguoiDaiDien: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      ChucVu: {
        type: Sequelize.STRING(50),
        allowNull: false,
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
    await queryInterface.dropTable("tblCompany");
  },
};
