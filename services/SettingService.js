const BaseService = require('./BaseService');

class SettingService extends BaseService {
  constructor(models) {
    super(models);
    this.Setting = models.Setting;
  }

  async getAll() {
    const rows = await this.Setting.findAll();
    const obj = {};
    rows.forEach(r => obj[r.key] = r.value);
    return obj;
  }

  async upsert(key, value) {
    const [row] = await this.Setting.upsert({ key, value });
    return row;
  }

  async bulkUpsert(obj) {
    const keys = Object.keys(obj);
    for (const k of keys) {
      await this.Setting.upsert({ key: k, value: obj[k] });
    }
    return this.getAll();
  }
}

module.exports = SettingService;
