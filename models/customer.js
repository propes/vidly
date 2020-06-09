const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const reqBodySchema = Joi.object({
   name: Joi.string()
      .required(),
   phone: Joi.string(),
   isGold: Joi.boolean()
});

const dbSchema = mongoose.Schema({
   name: { 
      type: String,
      required: true
   },
   phone: String,
   isGold: {
      type: Boolean,
      default: false
   }
});

const Model = mongoose.model('customer', dbSchema);

const reqBodyMapper = (body) => {
   const model = {};
   for (field in body) {
      model[field] = body[field];
   }
   return model;
}

module.exports = {
   Model: Model,
   schema: reqBodySchema,
   mapper: reqBodyMapper,
};