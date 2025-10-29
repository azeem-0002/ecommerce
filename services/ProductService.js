const BaseService = require('./BaseService');
const { Op } = require('sequelize');

class ProductService extends BaseService {
  constructor(models) {
    super(models);
    this.Product = models.Product;
    this.Variant = models.ProductVariant;
    this.Image = models.ProductImage;
    this.Category = models.Category;
    this.sequelize = models.sequelize;
  }

  async list({ page = 1, limit = 10, categoryId, q }) {
    const where = { deletedAt: null }; // only active (non-deleted) products

    if (categoryId) where.categoryId = categoryId;

    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.Product.findAndCountAll({
      where,
      include: [
        {
          model: this.Variant,
          as: 'variants',
          where: { deletedAt: null },
          required: false, // keep products even if they have no variants
        },
        {
          model: this.Image,
          as: 'images',
          where: { deletedAt: null },
          required: false, // keep products even if they have no images
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return { items: rows, total: count, page, limit };
  }


  async create(data) {
    const { variants, images, ...productData } = data;

    const product = await this.Product.create(productData);

    // If variants provided
    if (variants && Array.isArray(variants)) {
        for (const v of variants) {
        await this.Variant.create({ ...v, productId: product.id });
        }
    }

    // If images provided
    if (images && Array.isArray(images)) {
        for (const img of images) {
        await this.Image.create({ ...img, productId: product.id });
        }
    }

    return await this.Product.findByPk(product.id, {
        include: [
        { model: this.Variant, as: 'variants' },
        { model: this.Image, as: 'images' },
        ],
    });
    }


  async findById(id) {
    const product = await this.Product.findByPk(id, { include: ['variants','images','category'] });
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  }

  async update(id, data) {
    const { variants, images, ...productData } = data;
    const t = await this.sequelize.transaction();

    try {
      // 1️⃣ Find the product (within transaction)
      const product = await this.Product.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product) throw new Error('Product not found');

      // 2️⃣ Update main product fields
      await product.update(productData, { transaction: t });

      // 3️⃣ Handle variants (delete + recreate)
      if (variants && Array.isArray(variants)) {
        await this.Variant.destroy({ where: { productId: id }, transaction: t });

        for (const v of variants) {
          await this.Variant.create({ ...v, productId: id }, { transaction: t });
        }
      }

      // 4️⃣ Handle images (delete + recreate)
      if (images && Array.isArray(images)) {
        await this.Image.destroy({ where: { productId: id }, transaction: t });

        for (const img of images) {
          await this.Image.create({ ...img, productId: id }, { transaction: t });
        }
      }

      // 5️⃣ Commit only if all succeed
      await t.commit();

      // 6️⃣ Return updated product (outside transaction)
      return await this.Product.findByPk(id, {
        include: [
          { model: this.Variant, as: 'variants' },
          { model: this.Image, as: 'images' },
        ],
      });

    } catch (err) {
      // 7️⃣ Rollback on any error
      await t.  rollback();
      throw err;
    }
  }


  async delete(id) {
    const t = await this.sequelize.transaction();

    try {
      // 1️⃣ Find the product inside transaction
      const product = await this.Product.findByPk(id, {
        include: [
          { model: this.Variant, as: 'variants' },
          { model: this.Image, as: 'images' },
        ],
        transaction: t
      });

      if (!product) throw { status: 404, message: 'Product not found' };

      // 2️⃣ Soft delete related variants
      await this.Variant.update(
        { deletedAt: new Date() },
        { where: { productId: id }, transaction: t }
      );

      // 3️⃣ Soft delete related images
      await this.Image.update(
        { deletedAt: new Date() },
        { where: { productId: id }, transaction: t }
      );

      // 4️⃣ Soft delete the product itself
      await this.Product.update(
        { deletedAt: new Date() },
        { where: { id }, transaction: t }
      );

      // 5️⃣ Commit transaction
      await t.commit();

      // 6️⃣ Return success info
      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        message: 'Product and related variants/images soft deleted successfully'
      };

    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

}

module.exports = ProductService;
