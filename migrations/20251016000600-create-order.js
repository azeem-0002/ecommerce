'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orderNumber: { type: Sequelize.STRING, unique: true },
      customerName: { type: Sequelize.STRING, allowNull: false },
      customerPhone: { type: Sequelize.STRING, allowNull: false },
      customerEmail: { type: Sequelize.STRING },
      shippingAddress: { type: Sequelize.TEXT },
      totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'payment_received',
          'confirmed',
          'shipped',
          'delivered',
          'cancelled'
        ),
        defaultValue: 'pending'
      },
      paymentMethod: { type: Sequelize.STRING },
      paymentReference: { type: Sequelize.STRING },
      paymentScreenshotUrl: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Orders');
  }
};
