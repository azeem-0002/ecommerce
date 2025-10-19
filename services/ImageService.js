const BaseService = require('./BaseService');

class ImageService extends BaseService {
  constructor(models) {
    super(models);
    this.Image = models.ProductImage;
    this.Product = models.Product;
  }

  async create(productId, data) {
    const product = await this.Product.findByPk(productId);
    if (!product) throw { status: 404, message: 'Product not found' };
    return this.Image.create({ ...data, productId });
  }

  async delete(productId, imageId) {
    const image = await this.Image.findOne({ where: { id: imageId, productId } });
    if (!image) throw { status: 404, message: 'Image not found' };
    return image.destroy();
  }
}

module.exports = ImageService;
