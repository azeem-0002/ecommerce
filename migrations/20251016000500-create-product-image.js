'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductImages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      productId: {
        type: Sequelize.INTEGER,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE'
      },
      url: { type: Sequelize.STRING, allowNull: false },
      altText: { type: Sequelize.STRING },
      position: { type: Sequelize.INTEGER },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ProductImages');
  }
};
