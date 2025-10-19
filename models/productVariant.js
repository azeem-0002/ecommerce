'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    sku: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PKR' },
    size: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    imageUrl: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'ProductVariants',
    timestamps: true
  });

  ProductVariant.associate = models => {
    ProductVariant.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return ProductVariant;
};
