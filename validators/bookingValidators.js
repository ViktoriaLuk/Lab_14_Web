// validators/bookingValidators.js
const Joi = require('joi');

exports.createBookingSchema = Joi.object({
  checkIn: Joi.date().greater('now').required()
    .messages({
      'date.greater': 'Дата заїзду має бути в майбутньому',
      'any.required': 'Дата заїзду обов\'язкова'
    }),
  checkOut: Joi.date().greater(Joi.ref('checkIn')).required()
    .messages({
      'date.greater': 'Дата виїзду має бути після заїзду',
      'any.required': 'Дата виїзду обов\'язкова'
    }),
  guests: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'Кількість гостей має бути не менше 1',
      'any.required': 'Вкажіть кількість гостей'
    })
});