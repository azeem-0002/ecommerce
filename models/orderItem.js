'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productVariantId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    totalPrice: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    title_snapshot: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'OrderItems',
    timestamps: true
  });

  OrderItem.associate = models => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });
  };

  return OrderItem;
};
