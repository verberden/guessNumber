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
      .positive()
      .less(10000)
      .required(),
  }).unknown(true),
};
