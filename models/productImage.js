'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define('ProductImage', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    altText: { type: DataTypes.STRING, allowNull: true },
    position: { type: DataTypes.INTEGER, allowNull: true },
    deletedAt: { // ✅ added soft delete column
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ProductImages',
    timestamps: true,
    paranoid: true
  });

  ProductImage.associate = models => {
    ProductImage.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return ProductImage;
};
