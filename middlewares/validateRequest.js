const Joi = require('joi');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false, allowUnknown: false });
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details.map(d => d.message) });
    }
    next();
  };
}

module.exports = { validate };
