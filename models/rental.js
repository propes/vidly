const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const customer = require('./customer');
const movie = require('./movie');

const reqBodySchema = Joi.object({
   customerId: Joi.objectId(),
   movieId: Joi.objectId()
});

const dbSchema = mongoose.Schema({
   customer: {
      type: mongoose.Schema(_.pick(customer.dbSchema.obj, [ 'name', 'phone' ])),
      required: true
   },
   movie: movie.dbSchema,
   dateOut: {
      type: Date,
      required: true,
      default: Date.now
   },
   dateReturned: {
      type: Date
   },
   rentalFee: {
      type: Number,
      min: 0
   }
});

const Model = mongoose.model('rental', dbSchema);

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
   dbSchema: dbSchema
};