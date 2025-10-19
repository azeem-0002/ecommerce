'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: true },
    shippingAddress: { type: DataTypes.TEXT, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PKR' },
    status: { type: DataTypes.ENUM('pending','payment_received','confirmed','shipped','delivered','cancelled'), defaultValue: 'pending' },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    paymentReference: { type: DataTypes.STRING, allowNull: true },
    paymentScreenshotUrl: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'Orders',
    timestamps: true
  });

  Order.associate = models => {
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  };

  return Order;
};
