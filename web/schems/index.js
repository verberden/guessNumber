const Joi = require('@hapi/joi');

module.exports = {
  name: Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(255)
      .required(),
  }).unknown(true),
  number: Joi.object({
    guessNumber: Joi.number()
      .min(0)
      .less(10000)
      .unsafe()
      .required(),
  }).unknown(true),
};
