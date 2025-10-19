const BaseService = require('./BaseService');
const { Sequelize } = require('sequelize');

class OrderService extends BaseService {
  constructor(models) {
    super(models);
    this.Order = models.Order;
    this.OrderItem = models.OrderItem;
    this.Product = models.Product;
    this.Variant = models.ProductVariant;
    this.sequelize = models.sequelize;
    this.Setting = models.Setting;
  }

  async _generateOrderNumber() {
    const date = new Date();
    const dstr = date.toISOString().slice(0,10).replace(/-/g,'');
    // simple counter based on count today (not perfect but ok)
    const like = `ORD-${dstr}%`;
    const count = await this.Order.count({ where: { orderNumber: { [Sequelize.Op.like]: like } } });
    const seq = String(count + 1).padStart(4, '0');
    return `ORD-${dstr}-${seq}`;
  }

  async createOrder(payload) {
    const { customerName, customerPhone, customerEmail, shippingAddress, items, paymentMethod, paymentReference, paymentScreenshotUrl } = payload;

    if (!items || !Array.isArray(items) || items.length === 0) throw { status: 400, message: 'No items' };

    // validate items and compute totals
    let total = 0.0;
    const itemRecords = [];
    for (const it of items) {
      const { productId, productVariantId, quantity } = it;
      if (!productId || !quantity || quantity <= 0) throw { status: 400, message: 'Invalid item' };
      const product = await this.Product.findByPk(productId);
      if (!product) throw { status: 400, message: `Product ${productId} not found` };
      let unitPrice = 0.0;
      let title_snapshot = product.title;
      if (productVariantId) {
        const variant = await this.Variant.findOne({ where: { id: productVariantId, productId } });
        if (!variant) throw { status: 400, message: `Variant ${productVariantId} not found for product ${productId}` };
        if (variant.stock < quantity) throw { status: 400, message: `Insufficient stock for variant ${productVariantId}`, detail: { productId, variantId: productVariantId } };
        unitPrice = parseFloat(variant.price);
        title_snapshot = `${product.title} - ${variant.size || ''} ${variant.color || ''}`.trim();
      } else {
        // product-level price not defined; require variant
        throw { status: 400, message: 'productVariantId is required for now' };
      }
      const totalPrice = unitPrice * quantity;
      total += totalPrice;
      itemRecords.push({ productId, productVariantId, quantity, unitPrice, totalPrice, title_snapshot });
    }

    const orderNumber = await this._generateOrderNumber();

    // Save order and items
    const t = await this.sequelize.transaction();
    try {
      const order = await this.Order.create({
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        totalAmount: total.toFixed(2),
        currency: items[0] && (await this.Variant.findByPk(items[0].productVariantId)).currency || 'PKR',
        status: paymentScreenshotUrl ? 'payment_received' : 'pending',
        paymentMethod,
        paymentReference,
        paymentScreenshotUrl
      }, { transaction: t });

      for (const rec of itemRecords) {
        await this.OrderItem.create({
          orderId: order.id,
          productId: rec.productId,
          productVariantId: rec.productVariantId,
          quantity: rec.quantity,
          unitPrice: rec.unitPrice,
          totalPrice: rec.totalPrice,
          title_snapshot: rec.title_snapshot
        }, { transaction: t });
      }

      await t.commit();

      // fetch payment instructions from settings:
      const settings = await this.Setting.findAll();
      const paymentInstructions = {};
      settings.forEach(s => {
        if (s.key.startsWith('payment_')) {
          paymentInstructions[s.key] = s.value;
        }
      });

      const whatsapp = process.env.ADMIN_WHATSAPP || (await this.Setting.findOne({ where: { key: 'admin_whatsapp' } })).value;

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        currency: order.currency,
        paymentInstructions,
        whatsappNumber: whatsapp
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // Admin confirms an order and reduces stock in transaction
  async confirmOrder(orderId, updates) {
    const t = await this.sequelize.transaction();
    try {
      const order = await this.Order.findByPk(orderId, { include: [{ model: this.OrderItem, as: 'items' }], transaction: t, lock: t.LOCK.UPDATE });
      if (!order) throw { status: 404, message: 'Order not found' };
      if (order.status === 'cancelled') throw { status: 400, message: 'Order is cancelled' };

      // reduce stock
      for (const item of order.items) {
        if (item.productVariantId) {
          const variant = await this.Variant.findByPk(item.productVariantId, { transaction: t, lock: t.LOCK.UPDATE });
          if (!variant) throw { status: 400, message: `Variant ${item.productVariantId} not found` };
          if (variant.stock < item.quantity) throw { status: 400, message: `Insufficient stock for variant ${item.productVariantId}` };
          variant.stock = variant.stock - item.quantity;
          await variant.save({ transaction: t });
        }
      }

      // update order data
      if (updates.status) order.status = updates.status;
      if (updates.paymentReference) order.paymentReference = updates.paymentReference;

      await order.save({ transaction: t });
      await t.commit();
      return order;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async list({ page = 1, limit = 20, status }) {
    const where = {};
    if (status) where.status = status;
    const offset = (page - 1) * limit;
    const { rows, count } = await this.Order.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    return { items: rows, total: count, page, limit };
  }

  async getById(id) {
    const order = await this.Order.findByPk(id, { include: [{ model: this.OrderItem, as: 'items' }] });
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
  }

  async publicStatusLookup(orderNumber, phone) {
    const order = await this.Order.findOne({ where: { orderNumber } });
    if (!order) throw { status: 404, message: 'Order not found' };
    if (order.customerPhone !== phone) throw { status: 403, message: 'Phone does not match' };
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      paymentScreenshotUrl: order.paymentScreenshotUrl,
      paymentMethod: order.paymentMethod
    };
  }
}

module.exports = OrderService;
