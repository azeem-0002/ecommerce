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
    }
  }, {
    tableName: 'Categories',
    timestamps: true
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
