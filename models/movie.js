const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const genre = require('./genre');

const reqBodySchema = Joi.object({
   title: Joi.string()
      .required(),
   genre: genre.schema,
   numberInStock: Joi.number()
      .required(),
   dailyRentalRate: Joi.number()
      .required()
});

const dbSchema = mongoose.Schema({
   title: { 
      type: String,
      required: true
   },
   genre: genre.dbSchema,
   numberInStock: {
      type: Number,
      required: true
   },
   dailyRentalRate: {
      type: Number,
      required: true
   }
});

const Model = mongoose.model('movie', dbSchema);

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