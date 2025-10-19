'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Settings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      key: { type: Sequelize.STRING, unique: true },
      value: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Settings');
  }
};
