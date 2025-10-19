'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductVariants', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      productId: {
        type: Sequelize.INTEGER,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE'
      },
      sku: { type: Sequelize.STRING },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING, allowNull: false },
      size: { type: Sequelize.STRING },
      color: { type: Sequelize.STRING },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 },
      imageUrl: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ProductVariants');
  }
};
