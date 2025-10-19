const BaseService = require('./BaseService');
const { Op } = require('sequelize');

class ProductService extends BaseService {
  constructor(models) {
    super(models);
    this.Product = models.Product;
    this.Variant = models.ProductVariant;
    this.Image = models.ProductImage;
    this.Category = models.Category;
  }

  async list({ page = 1, limit = 10, categoryId, q }) {
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (q) where[Op.or] = [
      { title: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } }
    ];
    const offset = (page - 1) * limit;
    const { rows, count } = await this.Product.findAndCountAll({
      where,
      include: [{ model: this.Variant, as: 'variants' }, { model: this.Image, as: 'images' }],
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
    const product = await this.Product.findByPk(id);
    if (!product) throw { status: 404, message: 'Product not found' };
    return product.update(data);
  }

  async delete(id) {
    const product = await this.Product.findByPk(id);
    if (!product) throw { status: 404, message: 'Product not found' };
    return product.destroy();
  }
}

module.exports = ProductService;
