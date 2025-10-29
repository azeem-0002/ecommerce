module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
     deletedAt: { // ✅ added soft delete column
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Categories',
    timestamps: true,
    paranoid: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
      onDelete: 'CASCADE'
    });
  };

  return Category;
};
