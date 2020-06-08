const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const ModelRouter = require('./model-router');

mongoose.connect('mongodb://localhost/vidly')
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB...', err));

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

const reqBodyMapper = (body) => {
   const model = {};
   for (field in body) {
      model[field] = body[field];
   }
   return model;
}

const Customer = mongoose.model('customer', dbSchema);

const router = new ModelRouter(
   Customer,
   reqBodySchema,
   reqBodyMapper
);

module.exports = router;