const BaseService = require('./BaseService');

class CategoryService extends BaseService {
  constructor(models) {
    super(models);
    this.Category = models.Category;
  }

  async list() {
    return this.Category.findAll();
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
    const cat = await this.findById(id);
    if (!cat) throw { status: 404, message: 'Category not found' };
    return cat.destroy();
  }
}

module.exports = CategoryService;
