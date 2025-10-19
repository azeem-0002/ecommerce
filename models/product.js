'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
  }, {
    tableName: 'Products',
    timestamps: true
  });

  Product.associate = models => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Product.hasMany(models.ProductVariant, { foreignKey: 'productId', as: 'variants' });
    Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
  };

  return Product;
};
