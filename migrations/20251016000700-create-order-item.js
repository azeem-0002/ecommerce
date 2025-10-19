'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: 'Orders', key: 'id' },
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.INTEGER,
        references: { model: 'Products', key: 'id' },
        onDelete: 'SET NULL'
      },
      productVariantId: {
        type: Sequelize.INTEGER,
        references: { model: 'ProductVariants', key: 'id' },
        onDelete: 'SET NULL'
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      unitPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      totalPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      title_snapshot: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('OrderItems');
  }
};
