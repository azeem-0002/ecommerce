const BaseService = require('./BaseService');

class VariantService extends BaseService {
  constructor(models) {
    super(models);
    this.Variant = models.ProductVariant;
    this.Product = models.Product;
  }

  async create(productId, data) {
    const product = await this.Product.findByPk(productId);
    if (!product) throw { status: 404, message: 'Product not found' };
    return this.Variant.create({ ...data, productId });
  }

  async update(productId, variantId, data) {
    const variant = await this.Variant.findOne({ where: { id: variantId, productId } });
    if (!variant) throw { status: 404, message: 'Variant not found' };
    return variant.update(data);
  }

  async delete(productId, variantId) {
    // Find the variant that’s not already deleted
    const variant = await this.Variant.findOne({
      where: {
        id: variantId,
        productId,
        deletedAt: null
      }
    });

    if (!variant) throw { status: 404, message: 'Variant not found' };

    // Soft delete → mark as deleted
    await variant.update({ deletedAt: new Date() });

    return { message: 'Variant deleted successfully (soft delete)' };
  }

}

module.exports = VariantService;
