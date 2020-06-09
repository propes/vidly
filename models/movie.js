const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const genre = require('./genre');

const reqBodySchema = Joi.object({
   title: Joi.string().required().max(255),
   genreId: Joi.objectId(),
   numberInStock: Joi.number().required().min(0),
   dailyRentalRate: Joi.number().required().min(0)
});

const dbSchema = mongoose.Schema({
   title: { 
      type: String,
      required: true,
      trim: true,
      maxlength: 255
   },
   genre: {
      type: genre.dbSchema,
      required: true
   },
   numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255
   },
   dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255
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
   dbSchema
};