class BaseService {
  constructor(models) {
    // only store models or nothing — minimal
    this.models = models || null;
  }
}

module.exports = BaseService;
