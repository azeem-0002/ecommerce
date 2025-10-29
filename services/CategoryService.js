const BaseService = require('./BaseService');

class CategoryService extends BaseService {
  constructor(models) {
    super(models);
    this.Category = models.Category;
    this.Product = models.Product;
    this.ProductVariant = models.ProductVariant;
    this.ProductImage = models.ProductImage;
    this.sequelize = models.sequelize;
  }

  async list() {
    return this.Category.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']] // optional, to sort newest first
    });
  }

  async create(data) {
    return this.Category.create(data);
  }

  async findById(id) {
    return this.Category.findByPk(id);
  }

  async update(id, data) {
    const cat = await this.findById(id);
    if (!cat) throw { status: 404, message: 'Category not found' };
    return cat.update(data);
  }

  async delete(id) {
    const t = await this.sequelize.transaction();
    try {
      // 1️⃣ Find the category
      const category = await this.Category.findByPk(id, { transaction: t });
      if (!category) throw { status: 404, message: 'Category not found' };

      // 2️⃣ Find all products belonging to this category
      const products = await this.Product.findAll({
        where: { categoryId: id },
        transaction: t,
      });

      // 3️⃣ Soft delete related variants and images for each product
      for (const product of products) {
        await this.ProductVariant.update(
          { deletedAt: new Date() },
          { where: { productId: product.id }, transaction: t }
        );

        await this.ProductImage.update(
          { deletedAt: new Date() },
          { where: { productId: product.id }, transaction: t }
        );
      }

      // 4️⃣ Soft delete all products under this category
      await this.Product.update(
        { deletedAt: new Date() },
        { where: { categoryId: id }, transaction: t }
      );

      // 5️⃣ Soft delete the category itself
      await this.Category.update(
        { deletedAt: new Date() },
        { where: { id }, transaction: t }
      );

      // ✅ Commit transaction
      await t.commit();

      return { message: 'Category and all related products, variants, and images soft deleted successfully' };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

}

module.exports = CategoryService;
